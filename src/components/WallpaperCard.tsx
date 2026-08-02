'use client';

import React, { useState } from 'react';
import { Wallpaper } from '../data/wallpapers';
import { Download, Eye, Heart, Sparkles, Maximize2 } from 'lucide-react';

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
  const [downloadCount, setDownloadCount] = useState(wallpaper.downloads);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadCount((prev) => prev + 1);

    // Trigger image download
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl;
    link.download = `${wallpaper.slug}-4k-wallpaper.jpg`;
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
      className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <img
          src={wallpaper.thumbnailUrl}
          alt={wallpaper.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {wallpaper.isAiGenerated && (
              <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                AI Generated
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/50 text-slate-300 text-[11px] font-medium">
              {wallpaper.category}
            </span>
          </div>

          <button
            onClick={handleLike}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-pink-500/90 text-white shadow-lg shadow-pink-500/30'
                : 'bg-slate-950/60 text-slate-300 hover:text-pink-400 border border-slate-700/50'
            }`}
            aria-label="Like wallpaper"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Center Hover View Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="px-4 py-2 rounded-xl bg-indigo-600/90 text-white text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Maximize2 className="w-4 h-4" /> Preview Wallpaper
          </span>
        </div>

        {/* Resolution Tag */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400">
          {wallpaper.resolution}
        </div>
      </div>

      {/* Card Details & Action Footer */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-slate-900/40">
        <div>
          <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {wallpaper.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {wallpaper.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 hover:text-slate-200">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {wallpaper.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 hover:text-slate-200">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              {downloadCount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}