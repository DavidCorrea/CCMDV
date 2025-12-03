import React from 'react';

interface LiveStreamData {
  videoId: string;
  title: string;
}

interface LiveStreamProps {
  liveStream: LiveStreamData | null;
  liveNowText: string;
  noLiveText: string;
}

export function LiveStream({ liveStream, liveNowText, noLiveText }: LiveStreamProps) {
  if (!liveStream) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
        <p className="text-blue-800 text-lg">{noLiveText}</p>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg inline-block">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
          {liveNowText}
        </span>
      </div>
      <div className="bg-gray-900 rounded-b-lg overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${liveStream.videoId}?autoplay=1&mute=1&playsinline=1`}
            title={liveStream.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{liveStream.title}</h2>
      </div>
    </section>
  );
}

