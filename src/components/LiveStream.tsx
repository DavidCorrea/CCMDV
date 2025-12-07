import React, { useState } from 'react';

interface LiveStreamData {
  videoId: string;
  title: string;
}

interface LiveStreamProps {
  liveStream: LiveStreamData | null;
  liveNowText: string;
  noLiveText: string;
}

const shareMessage = `¡Buenos días! ¡Dios te bendiga!

Te invitamos a nuestro culto de hoy a las 10.30hs.

https://ccmdv.com/vivo

¡No te olvides de compartir la transmisión en tus redes sociales y a tus contactos! ¡Te esperamos!`;

export function LiveStream({ liveStream, liveNowText, noLiveText }: LiveStreamProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareMessage;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

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
      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{liveStream.title}</h2>
        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ¡Copiado!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir
            </>
          )}
        </button>
      </div>
    </section>
  );
}

