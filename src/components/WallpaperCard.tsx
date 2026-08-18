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
      className="group relative rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:z-30 hover:shadow-2xl hover:shadow-[#0B1F4D]/30 break-inside-avoid mb-4 flex flex-col"
    >
      {/* Natural Aspect Ratio Image Container */}
      <div className="relative w-full overflow-hidden bg-[#0B1F4D] rounded-3xl">
        <img
          src={imgSrc}
          alt={wallpaper.title}
          loading="lazy"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop');
          }}
          className="w-full h-auto object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Pixabay-Style Glass Hover Action Overlay Panel */}
        <div
          className={`absolute inset-0 glass-hover-panel transition-all duration-300 ease-out flex flex-col justify-between p-3.5 ${
            isOverlayVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Top Panel Controls */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full premium-category-badge text-[11px] font-semibold tracking-wide border border-[#DFF7FF]/20 shadow-md">
              {wallpaper.category}
            </span>

            {/* Save 4K Button */}
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-full premium-save-btn text-[#0B1F4D] text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#0B1F4D]" />
              Save 4K
            </button>
          </div>

          {/* Center Hover Preview Button */}
          <div className="flex justify-center">
            <span className="px-4 py-2 rounded-full premium-view-pill text-white text-xs font-semibold backdrop-blur-md border border-[#DFF7FF]/30 shadow-xl flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-[#DFF7FF]" /> View Pin
            </span>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 premium-views-pill px-2.5 py-1 rounded-full backdrop-blur-md text-[11px]">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{(wallpaper.views || 100).toLocaleString()}</span>
            </div>

            <button
              onClick={handleLike}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? 'premium-favorite-active text-[#0B1F4D]'
                  : 'premium-favorite-btn text-slate-200'
              }`}
              aria-label="Favorite Pin"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#0B1F4D]' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}