import type { Config } from '@netlify/edge-functions';

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  // Only handle GET requests to /api/youtube-data
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  if (url.pathname !== '/api/youtube-data') {
    return context.next();
  }

  // @ts-ignore - Deno is available in Netlify Edge Functions runtime
  const apiKey = Deno.env.get('YOUTUBE_API_KEY')
  // @ts-ignore - Deno is available in Netlify Edge Functions runtime
  const channelId = Deno.env.get('YOUTUBE_CHANNEL_ID')

  if (!apiKey || !channelId) {
    console.error('Missing YouTube API credentials:', { 
      hasApiKey: !!apiKey, 
      hasChannelId: !!channelId 
    });
    return new Response(
      JSON.stringify({ 
        error: 'YouTube API credentials not configured',
        debug: {
          hasApiKey: !!apiKey,
          hasChannelId: !!channelId,
        }
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Check for live stream
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    
    let liveStream = null;
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.items && searchData.items.length > 0) {
        const liveVideo = searchData.items[0];
        liveStream = {
          videoId: liveVideo.id.videoId,
          title: liveVideo.snippet.title,
          description: liveVideo.snippet.description,
          thumbnail: `https://img.youtube.com/vi/${liveVideo.id.videoId}/hqdefault.jpg`,
          isLive: true,
        };
      }
    }

    // Get recent videos
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelResponse = await fetch(channelUrl);
    
    let recentVideos = [];
    if (channelResponse.ok) {
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        const uploadsPlaylistId = channelData.items[0].contentDetails?.relatedPlaylists?.uploads;
        
        if (uploadsPlaylistId) {
          const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=12&key=${apiKey}`;
          const playlistResponse = await fetch(playlistUrl);
          
          if (playlistResponse.ok) {
            const playlistData = await playlistResponse.json();
            
            if (playlistData.items) {
              const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
              const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`;
              const statsResponse = await fetch(statsUrl);
              
              if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                const statsMap = new Map(statsData.items.map((item: any) => [item.id, item]));
                
                recentVideos = playlistData.items.map((item: any) => {
                  const videoId = item.snippet.resourceId.videoId;
                  const stats: any = statsMap.get(videoId);
                  
                  return {
                    id: videoId,
                    videoId: videoId,
                    title: item.snippet.title || 'Sin título',
                    description: item.snippet.description || '',
                    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    publishedAt: item.snippet.publishedAt,
                    viewCount: (stats && stats.statistics && stats.statistics.viewCount) ? stats.statistics.viewCount : '0',
                    isLive: false,
                  };
                });
              }
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ liveStream, recentVideos }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        },
      }
    );
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch YouTube data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const config: Config = {
  path: '/api/youtube-data',
};

