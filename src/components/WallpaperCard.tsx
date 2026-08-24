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
  const [isMobileTapped, setIsMobileTapped] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    wallpaper.thumbnailUrl || wallpaper.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
  );

  const handleCardClick = () => {
    // Mobile double-tap behavior: first tap shows details, second tap opens modal
    if (typeof window !== 'undefined' && window.innerWidth < 768 && !isMobileTapped) {
      setIsMobileTapped(true);
      return;
    }
    onSelect(wallpaper);
  };

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

  const isOverlayVisible = isHovered || isMobileTapped;

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMobileTapped(false);
      }}
      className="group relative rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:z-30 hover:shadow-2xl hover:shadow-[#0B1F4D]/25 break-inside-avoid mb-4 flex flex-col transform-gpu"
    >
      {/* Natural Aspect Ratio Image Container */}
      <div className="relative w-full overflow-hidden bg-[#0B1F4D]/10 rounded-3xl">
        <img
          src={imgSrc}
          alt={wallpaper.title}
          loading="lazy"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop');
          }}
          className="w-full h-auto object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* 100% Crystal Clear Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 transition-all duration-300 ease-out flex flex-col justify-between p-3 sm:p-3.5 ${
            isOverlayVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Top Panel Controls */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Category Glass Pill (Sharp Text) */}
            <span className="px-3 py-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/35 text-white text-[11px] font-extrabold tracking-wide shadow-md transition-all duration-200 antialiased [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
              {wallpaper.category}
            </span>

            {/* Save Button (Sharp Text & Icon) */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/40 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 antialiased [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]"
            >
              <Download className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
              Save
            </button>
          </div>

          {/* Center Hover Preview Button (Sharp Text) */}
          <div className="flex justify-center">
            <span className="px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/40 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 antialiased [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
              <Maximize2 className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" /> View Pin
            </span>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between text-xs text-white">
            
            {/* Views Count Glass Pill (Sharp Text) */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/30 text-white text-[11px] font-extrabold shadow-md transition-all duration-200 antialiased [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
              <Eye className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
              <span>{(wallpaper.views || 100).toLocaleString()}</span>
            </div>

            {/* Favorite / Like Glass Button */}
            <button
              onClick={handleLike}
              className={`p-2.5 rounded-full backdrop-blur-md border border-white/40 shadow-md transition-all duration-200 hover:scale-110 active:scale-95 antialiased ${
                isFavorite
                  ? 'bg-white text-red-500 shadow-red-500/20'
                  : 'bg-black/35 hover:bg-black/55 text-white'
              }`}
              aria-label="Favorite Pin"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'}`} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}