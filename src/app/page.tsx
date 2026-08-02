'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import WallpaperCard from '../components/WallpaperCard';
import WallpaperModal from '../components/WallpaperModal';
import { INITIAL_WALLPAPERS, Wallpaper } from '../data/wallpapers';
import { Sparkles, Flame, Search, ShieldCheck, FileText, Info, Compass, AlertCircle } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAiOnly, setShowAiOnly] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Toggle favorite wallpapers
  const handleFavoriteToggle = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter wallpapers based on search, category, and AI toggle
  const filteredWallpapers = useMemo(() => {
    return INITIAL_WALLPAPERS.filter((wallpaper) => {
      // Category filter
      if (selectedCategory !== 'All' && wallpaper.category !== selectedCategory) {
        return false;
      }
      // AI-only filter
      if (showAiOnly && !wallpaper.isAiGenerated) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = wallpaper.title.toLowerCase().includes(query);
        const matchesDescription = wallpaper.description.toLowerCase().includes(query);
        const matchesCategory = wallpaper.category.toLowerCase().includes(query);
        const matchesTags = wallpaper.tags.some((tag) => tag.toLowerCase().includes(query));
        return matchesTitle || matchesDescription || matchesCategory || matchesTags;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, showAiOnly]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={favoriteIds.length}
      />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center overflow-hidden">
        {/* Glow Effects Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Next-Gen 4K AI Generated Wallpapers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Elevate Your Screen with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ultra HD AI Wallpapers
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Free high-resolution 4K wallpapers for Desktop, Mobile, AMOLED & OLED screens. Updated daily with original AI artwork.
          </p>

          {/* Mobile Search Input in Hero */}
          <div className="md:hidden pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search 4K wallpapers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Categories Bar */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showAiOnly={showAiOnly}
          onToggleAiOnly={() => setShowAiOnly(!showAiOnly)}
        />

        {/* Top AdSense Banner Placeholder */}
        <div className="w-full my-6 h-20 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800/80 flex items-center justify-center text-xs text-slate-600 uppercase tracking-widest">
          <span>Advertisement Area (Header AdSense Banner)</span>
        </div>

        {/* Section Title & Results Info */}
        <div className="flex items-center justify-between my-6 border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              {selectedCategory === 'All' ? 'Featured Wallpapers' : `${selectedCategory} Wallpapers`}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50 ml-1">
              {filteredWallpapers.length}
            </span>
          </div>
        </div>

        {/* Wallpapers Grid */}
        {filteredWallpapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWallpapers.map((wallpaper) => (
              <WallpaperCard
                key={wallpaper.id}
                wallpaper={wallpaper}
                onSelect={setSelectedWallpaper}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={favoriteIds.includes(wallpaper.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 rounded-3xl bg-slate-900/30 border border-slate-800">
            <Compass className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">No wallpapers found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any wallpapers matching your search "{searchQuery}". Try searching for something else or browse categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowAiOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Fullscreen Wallpaper Popup Modal */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        onClose={() => setSelectedWallpaper(null)}
        onFavoriteToggle={handleFavoriteToggle}
        isFavorite={selectedWallpaper ? favoriteIds.includes(selectedWallpaper.id) : false}
      />

      {/* Production Footer (Google AdSense & SEO Essential Links) */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-lg">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                AI Wallpapers Hub
              </div>
              <p className="text-slate-500 max-w-md">
                Your primary source for high quality 4K and Ultra HD AI generated wallpapers for Desktop, Laptop, and Smartphones.
              </p>
            </div>

            {/* Google AdSense Compliant Footer Real Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
              <Link href="/privacy-policy" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Terms of Service
              </Link>
              <Link href="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> About Us
              </Link>
              <Link href="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Contact Us
              </Link>
              <Link href="/disclaimer" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Disclaimer
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-600 gap-4 text-[11px]">
            <div>© {new Date().getFullYear()} AI Wallpapers Hub. All rights reserved.</div>
            <div>Built for High Speed, SEO & Google AdSense Approval.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}