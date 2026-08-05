'use client';

import React, { useState } from 'react';
import { Wallpaper } from '../data/wallpapers';
import {
  X,
  Download,
  Eye,
  Heart,
  Share2,
  Calendar,
  Monitor,
  Tag,
  Check,
} from 'lucide-react';

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export default function WallpaperModal({
  wallpaper,
  onClose,
  onFavoriteToggle,
  isFavorite = false,
}: WallpaperModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadCount, setDownloadCount] = useState(
    wallpaper ? wallpaper.downloads || 0 : 0
  );

  if (!wallpaper) return null;

  const handleDownload = (resolutionName: string) => {
    setDownloadCount((prev) => prev + 1);
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl || wallpaper.thumbnailUrl;
    link.download = `${wallpaper.slug || 'pin'}-${resolutionName}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-[#161b22] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col lg:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700/60 hover:bg-slate-800 transition-all shadow-lg"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Pinterest Tall Pin Preview */}
        <div className="lg:w-3/5 bg-[#0d1117] relative flex items-center justify-center p-4 min-h-[350px] sm:min-h-[500px] overflow-hidden group">
          <img
            src={wallpaper.imageUrl || wallpaper.thumbnailUrl}
            alt={wallpaper.title}
            className="w-full h-full object-contain max-h-[78vh] rounded-2xl shadow-2xl"
          />
        </div>

        {/* Right Side: Pinterest Pin Info & Multi-Resolution Downloads */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#161b22] border-t lg:border-t-0 lg:border-l border-slate-800/80">
          <div className="space-y-6">
            {/* Header & Category Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-red-400 text-xs font-semibold uppercase tracking-wider">
                  {wallpaper.category}
                </span>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                  title="Share Pin"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {wallpaper.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {wallpaper.description}
              </p>
            </div>

            {/* Metadata Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#0d1117] border border-slate-800/80 flex items-center gap-2.5">
                <Monitor className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <div className="text-slate-500 text-[10px]">Resolution</div>
                  <div className="font-semibold text-slate-200">{wallpaper.resolution || '3840 x 2160'}</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d1117] border border-slate-800/80 flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <div className="text-slate-500 text-[10px]">Views</div>
                  <div className="font-semibold text-slate-200">{(wallpaper.views || 100).toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d1117] border border-slate-800/80 flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-500 text-[10px]">Downloads</div>
                  <div className="font-semibold text-slate-200">{downloadCount.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d1117] border border-slate-800/80 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-slate-500 text-[10px]">Created</div>
                  <div className="font-semibold text-slate-200">{wallpaper.createdAt || '2026-08-05'}</div>
                </div>
              </div>
            </div>

            {/* Tags Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(wallpaper.tags || [wallpaper.category]).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-slate-800/60 text-slate-400 text-[11px] font-medium flex items-center gap-1 border border-slate-700/40"
                >
                  <Tag className="w-3 h-3 text-slate-500" /> #{tag}
                </span>
              ))}
            </div>

            {/* AdSense Banner Area Placeholder */}
            <div className="w-full h-16 rounded-2xl bg-[#0d1117] border border-dashed border-slate-800 flex items-center justify-center text-[11px] text-slate-600 uppercase tracking-widest">
              <span>Advertisement Area (AdSense)</span>
            </div>
          </div>

          {/* Action Buttons: Red Pinterest Download Resolutions & Favorite */}
          <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300">
              Save Pin Resolutions:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleDownload('4K-UltraHD')}
                className="py-2.5 px-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-red-600/30"
              >
                <Download className="w-3.5 h-3.5" /> 4K Ultra HD
              </button>
              <button
                onClick={() => handleDownload('1080p-FullHD')}
                className="py-2.5 px-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> 1080p FHD
              </button>
              <button
                onClick={() => handleDownload('Mobile-HD')}
                className="py-2.5 px-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700 col-span-2 sm:col-span-1"
              >
                <Download className="w-3.5 h-3.5" /> Mobile HD
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onFavoriteToggle && onFavoriteToggle(wallpaper.id)}
                className={`w-full py-2.5 rounded-full text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                  isFavorite
                    ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
                {isFavorite ? 'Saved to Favorites' : 'Save Pin to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}