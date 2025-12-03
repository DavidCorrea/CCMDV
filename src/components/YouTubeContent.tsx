import React, { useEffect, useState } from 'react';
import { LiveStream } from './LiveStream';
import { VideoCard } from './VideoCard';

interface LiveStreamData {
  videoId: string;
  title: string;
}

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubeData {
  liveStream: LiveStreamData | null;
  recentVideos: Video[];
}

interface YouTubeContentProps {
  liveNowText: string;
  noLiveText: string;
  recentVideosText: string;
  demoMode?: boolean;
}

export function YouTubeContent({ liveNowText, noLiveText, recentVideosText, demoMode = false }: YouTubeContentProps) {
  const [data, setData] = useState<YouTubeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(demoMode);

  useEffect(() => {
    // Check URL params on client side as well (in case page was statically generated)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setIsDemoMode(urlParams.get('demo') === 'true' || demoMode);
    }
  }, [demoMode]);

  useEffect(() => {
    async function fetchYouTubeData() {
      try {
        setLoading(true);
        const apiUrl = isDemoMode ? '/api/youtube-data?demo=true' : '/api/youtube-data';
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch YouTube data:', response.status, errorText);
          throw new Error(`Failed to fetch YouTube data: ${response.status}`);
        }
        
        const fetchedData = await response.json();
        setData(fetchedData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading YouTube data';
        setError(errorMessage);
        console.error('Error fetching YouTube data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchYouTubeData();
  }, [isDemoMode]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <p className="text-yellow-800">
          <strong>Lo sentimos.</strong> No se pudieron obtener los videos recientes.
        </p>
        <p className="text-yellow-800 text-sm mt-2">
          <strong>Error:</strong> {error}
        </p>
        <p className="text-yellow-800 text-sm mt-2">
          Make sure you're running <code>npm run dev:netlify</code> (not <code>npm run dev</code>) to enable Edge Functions locally.
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <LiveStream 
        liveStream={data.liveStream} 
        liveNowText={liveNowText}
        noLiveText={noLiveText}
      />
      
      {data.recentVideos && data.recentVideos.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {recentVideosText}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.recentVideos.map((video) => (
              <VideoCard key={video.videoId} video={video} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

