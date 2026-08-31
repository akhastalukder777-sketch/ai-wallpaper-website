// src/components/WallpaperDetailActions.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Wallpaper } from '../data/wallpapers';
import { getStoredFavorites, saveStoredFavorites } from '../lib/db';
import {
  Download,
  Heart,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';

interface WallpaperDetailActionsProps {
  wallpaper: Wallpaper;
}

export default function WallpaperDetailActions({
  wallpaper,
}: WallpaperDetailActionsProps) {
  const [downloadCount, setDownloadCount] = useState(wallpaper.downloads || 0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const favs = getStoredFavorites();
    setIsFavorite(favs.includes(wallpaper.id));
  }, [wallpaper.id]);

  const handleDownload = (resolutionLabel: string) => {
    setDownloadCount((prev) => prev + 1);

    const link = document.createElement('a');
    link.href = wallpaper.imageUrl || wallpaper.thumbnailUrl;
    link.download = `${wallpaper.slug || 'wallpaper'}-${resolutionLabel}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFavoriteToggle = () => {
    const favs = getStoredFavorites();
    const updated = favs.includes(wallpaper.id)
      ? favs.filter((id) => id !== wallpaper.id)
      : [...favs, wallpaper.id];

    saveStoredFavorites(updated);
    setIsFavorite(updated.includes(wallpaper.id));
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        if (navigator.share) {
          await navigator.share({
            title: wallpaper.title,
            text: wallpaper.description,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
        }
      } catch {
        // Fallback clipboard
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="text-xs font-bold uppercase tracking-wider text-[#0B1F4D]/70 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#178DFF]" />
        Download In Ultra High Resolution:
      </div>

      {/* Download Resolution Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => handleDownload('4K-UltraHD')}
          className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#178DFF] via-[#00B4D8] to-[#00BFA6] hover:opacity-95 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>4K Ultra HD</span>
        </button>

        <button
          type="button"
          onClick={() => handleDownload('1080p-FHD')}
          className="py-3 px-4 rounded-2xl bg-white/90 hover:bg-white text-[#0B1F4D] border border-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>1080p Full HD</span>
        </button>

        <button
          type="button"
          onClick={() => handleDownload('Mobile-HD')}
          className="py-3 px-4 rounded-2xl bg-white/90 hover:bg-white text-[#0B1F4D] border border-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Mobile HD</span>
        </button>
      </div>

      {/* Secondary Actions (Favorite & Share) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleFavoriteToggle}
          className={`py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            isFavorite
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white/80 hover:bg-white border-slate-200 text-[#0B1F4D]'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
            }`}
          />
          <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="py-2.5 px-4 rounded-2xl bg-white/80 hover:bg-white border border-slate-200 text-[#0B1F4D] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Share Wallpaper</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}