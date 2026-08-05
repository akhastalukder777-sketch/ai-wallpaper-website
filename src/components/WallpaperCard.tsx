'use client';

import React, { useState } from 'react';
import { Wallpaper } from '../data/wallpapers';
import { Download, Eye, Heart, Maximize2 } from 'lucide-react';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onSelect: (wallpaper: Wallpaper) => void;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export default function WallpaperCard({
  wallpaper,
  onSelect,
  onFavoriteToggle,
  isFavorite = false,
}: WallpaperCardProps) {
  const [downloadCount, setDownloadCount] = useState(wallpaper.downloads || 0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    wallpaper.thumbnailUrl || wallpaper.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
  );

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadCount((prev) => prev + 1);

    const link = document.createElement('a');
    link.href = wallpaper.imageUrl || imgSrc;
    link.download = `${wallpaper.slug || 'wallpaper'}-4k.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(wallpaper.id);
    }
  };

  return (
    <div
      onClick={() => onSelect(wallpaper)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 break-inside-avoid mb-4 flex flex-col"
    >
      {/* Pinterest Pin Image Container */}
      <div className="relative aspect-[3/4] sm:aspect-[9/14] w-full overflow-hidden bg-slate-900 rounded-3xl">
        <img
          src={imgSrc}
          alt={wallpaper.title}
          loading="lazy"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop');
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Pinterest Dark Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 flex flex-col justify-between p-3.5 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Pinterest Overlay Controls */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 text-[11px] font-semibold tracking-wide border border-slate-700/50 shadow-md">
              {wallpaper.category}
            </span>

            {/* Red Pinterest Style Download / Save Button */}
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Save 4K
            </button>
          </div>

          {/* Center Hover Preview Button */}
          <div className="flex justify-center">
            <span className="px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/60 shadow-xl flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-red-400" /> View Pin
            </span>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 bg-slate-950/70 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px]">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{(wallpaper.views || 100).toLocaleString()}</span>
            </div>

            <button
              onClick={handleLike}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40'
                  : 'bg-slate-950/70 text-slate-200 hover:text-pink-400'
              }`}
              aria-label="Favorite Pin"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Resolution Tag (Default Visible) */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-slate-400 border border-slate-800 group-hover:opacity-0 transition-opacity">
          {wallpaper.resolution || '3840 x 2160'}
        </div>
      </div>

      {/* Pinterest Pin Title & Info Below Image */}
      <div className="p-3 bg-transparent">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-red-400 transition-colors line-clamp-1">
          {wallpaper.title}
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
          {wallpaper.description}
        </p>
      </div>
    </div>
  );
}