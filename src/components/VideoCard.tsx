import React from 'react';

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface VideoCardProps {
  video: Video;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'hace unos momentos';
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

export function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div
        className="relative w-full bg-cover bg-center bg-gray-200 overflow-hidden"
        style={{ paddingBottom: '56.25%', backgroundImage: `url('${video.thumbnail}')` }}
        role="img"
        aria-label={video.title}
      >
        <img
          src={video.thumbnail}
          alt=""
          className="sr-only"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
          <svg className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <div className="text-sm text-gray-600">
          <span>{formatDate(video.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}

