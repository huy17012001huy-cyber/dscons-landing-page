import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';

interface YouTubePlayerProps {
  url: string;
  className?: string;
  title?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url, className, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Hàm trích xuất video ID
  const getVideoId = (rawUrl: string) => {
    if (!rawUrl) return "";
    try {
      if (rawUrl.includes('v=')) return rawUrl.split('v=')[1].split('&')[0];
      if (rawUrl.includes('youtu.be/')) return rawUrl.split('youtu.be/')[1].split('?')[0];
      if (rawUrl.includes('embed/')) return rawUrl.split('embed/')[1].split('?')[0];
      return rawUrl;
    } catch (e) {
      return "";
    }
  };

  const videoId = getVideoId(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=1`;

  return (
    <div className={`${className} relative group cursor-pointer bg-black overflow-hidden rounded-2xl`} onClick={() => setIsLoaded(true)}>
      {!isLoaded ? (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={thumbnailUrl} 
            alt={title || "Video thumbnail"} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
              <Play className="w-10 h-10 fill-current ml-1" />
            </div>
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title={title || "YouTube video player"}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default YouTubePlayer;
