/**
 * YouTube API utilities
 * 
 * To use this, you'll need:
 * 1. A YouTube Data API v3 key (get it from https://console.cloud.google.com/)
 * 2. Your YouTube Channel ID
 * 
 * Set these as environment variables:
 * - PUBLIC_YOUTUBE_API_KEY
 * - PUBLIC_YOUTUBE_CHANNEL_ID
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  isLive: boolean;
  videoId: string;
}

export interface YouTubeLiveStream {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  isLive: true;
}

/**
 * Check if a video is currently live
 */
export async function checkLiveStream(
  channelId: string,
  apiKey: string
): Promise<YouTubeLiveStream | null> {
  try {
    // Search for live broadcasts
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      console.error('YouTube API error:', searchResponse.statusText);
      return null;
    }
    
    const searchData = await searchResponse.json();
    
    if (searchData.items && searchData.items.length > 0) {
      const liveVideo = searchData.items[0];
      
      // Use YouTube's direct thumbnail URL - hqdefault is more reliable
      const thumbnail = `https://img.youtube.com/vi/${liveVideo.id.videoId}/hqdefault.jpg`;
      
      return {
        videoId: liveVideo.id.videoId,
        title: liveVideo.snippet.title,
        description: liveVideo.snippet.description,
        thumbnail: thumbnail,
        isLive: true,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error checking live stream:', error);
    return null;
  }
}

/**
 * Get recent videos from a YouTube channel
 */
export async function getRecentVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 12
): Promise<YouTubeVideo[]> {
  try {
    // First, get the uploads playlist ID
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelResponse = await fetch(channelUrl);
    
    if (!channelResponse.ok) {
      console.error('YouTube API error:', channelResponse.statusText);
      return [];
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return [];
    }
    
    const uploadsPlaylistId = channelData.items[0].contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) {
      return [];
    }
    
    // Get videos from the uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
    const playlistResponse = await fetch(playlistUrl);
    
    if (!playlistResponse.ok) {
      console.error('YouTube API error:', playlistResponse.statusText);
      return [];
    }
    
    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items) {
      return [];
    }
    
    // Get video statistics
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`;
    const statsResponse = await fetch(statsUrl);
    
    if (!statsResponse.ok) {
      console.error('YouTube API error:', statsResponse.statusText);
      return [];
    }
    
    const statsData = await statsResponse.json();
    const statsMap = new Map(statsData.items.map((item: any) => [item.id, item]));
    
    return playlistData.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const stats: any = statsMap.get(videoId);
      
      // Use YouTube's direct thumbnail URL - most reliable method
      // hqdefault is more widely available than maxresdefault
      const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      
      return {
        id: videoId,
        videoId: videoId,
        title: item.snippet.title || 'Sin título',
        description: item.snippet.description || '',
        thumbnail: thumbnail,
        publishedAt: item.snippet.publishedAt,
        viewCount: (stats && stats.statistics && stats.statistics.viewCount) ? stats.statistics.viewCount : '0',
        isLive: false,
      };
    });
  } catch (error) {
    console.error('Error fetching recent videos:', error);
    return [];
  }
}

/**
 * Format view count for display
 */
export function formatViewCount(count: string): string {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace unos momentos';
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  }
  
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

