'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Menu,
  X,
  Flame,
  Grid,
  ChevronDown,
  Search,
  Shuffle,
  Clock,
  Home as HomeIcon,
  Compass,
} from 'lucide-react';
import { CATEGORIES } from '../data/wallpapers';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  favoriteCount?: number;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  onSelectRandomWallpaper?: () => void;
  onSelectSection?: (section: 'all' | 'latest' | 'trending') => void;
  activeSection?: 'all' | 'latest' | 'trending';
}

export default function Navbar({
  searchQuery = '',
  onSearchChange,
  favoriteCount = 0,
  activeCategory = 'All',
  onSelectCategory,
  onSelectRandomWallpaper,
  onSelectSection,
  activeSection = 'all',
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleNavClick = (section: 'all' | 'latest' | 'trending') => {
    if (onSelectSection) onSelectSection(section);
    setIsCategoryDropdownOpen(false);
  };

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) onSelectCategory(cat);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    const categoriesElement = document.getElementById('categories');
    if (categoriesElement) {
      categoriesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Navbar Container Inspired by 4th Navbar in Reference */}
      <header className="sticky top-3 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
        <div className="bg-[#090d12]/95 border border-slate-800/80 rounded-full shadow-2xl backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* LEFT: Wallpaper Logo + Brand */}
          <Link href="/" onClick={() => handleNavClick('all')} className="flex items-center gap-2.5 group shrink-0 pr-3 border-r border-slate-800/80">
            <div className="w-9 h-9 rounded-full bg-[#F1FEC8] p-0.5 shadow-md shadow-[#F1FEC8]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d12] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#F1FEC8]" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black bg-gradient-to-r from-white via-slate-100 to-[#F1FEC8] bg-clip-text text-transparent tracking-tight">
                Wallpapers<span className="text-[#F1FEC8]">.</span>
              </span>
            </div>
          </Link>

          {/* CENTER: 4th-Navbar Inspired Clean Navigation Pill (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-950/60 border border-slate-800/80 rounded-full p-1 divide-x divide-slate-800/80">
            {/* Latest */}
            <button
              onClick={() => handleNavClick('latest')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'latest'
                  ? 'bg-[#F1FEC8] text-[#090d12] shadow-md shadow-[#F1FEC8]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Latest
            </button>

            {/* Trending */}
            <button
              onClick={() => handleNavClick('trending')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'trending'
                  ? 'bg-[#F1FEC8] text-[#090d12] shadow-md shadow-[#F1FEC8]/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Trending
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isCategoryDropdownOpen || activeCategory !== 'All'
                    ? 'text-[#F1FEC8]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-[#F1FEC8]" />
                <span>Categories</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-[#090d12]/98 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl p-2 z-50 grid grid-cols-2 gap-1 animate-fade-in">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-[#F1FEC8] text-[#090d12] font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-[#F1FEC8]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Random Wallpaper Button */}
            <button
              onClick={onSelectRandomWallpaper}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-[#F1FEC8] hover:bg-slate-800/50 flex items-center gap-1.5 transition-all"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#F1FEC8]" />
              Random
            </button>
          </div>

          {/* RIGHT: Expandable Search + Favorites */}
          <div className="flex items-center gap-2">
            {/* Expandable Search Container */}
            <div className="relative flex items-center">
              {isSearchExpanded ? (
                <div className="flex items-center bg-slate-950 border border-[#F1FEC8]/40 rounded-full px-3 py-1.5 transition-all w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#F1FEC8] shrink-0 mr-2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search 4K pins..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setIsSearchExpanded(false);
                      if (onSearchChange) onSearchChange('');
                    }}
                    className="text-slate-400 hover:text-white ml-1 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-slate-300 hover:text-[#F1FEC8] hover:border-[#F1FEC8]/30 transition-all shadow-md"
                  aria-label="Expand Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Favorites Counter Button */}
            <button
              aria-label="Saved Favorites"
              className="relative p-2.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-slate-300 hover:text-[#F1FEC8] hover:border-[#F1FEC8]/30 transition-all shadow-md"
            >
              <Heart className="w-4 h-4" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F1FEC8] text-[#090d12] text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Mobile Top Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-slate-300 hover:bg-slate-800 lg:hidden"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Full Expanded Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 bg-[#090d12]/98 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-2xl space-y-3 animate-fade-in">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  handleNavClick('all');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <HomeIcon className="w-4 h-4 text-[#F1FEC8]" />
                Home
              </button>
              <button
                onClick={() => {
                  handleNavClick('latest');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <Clock className="w-4 h-4 text-sky-400" />
                Latest Wallpapers
              </button>
              <button
                onClick={() => {
                  handleNavClick('trending');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                Trending
              </button>
              <button
                onClick={() => {
                  if (onSelectRandomWallpaper) onSelectRandomWallpaper();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <Shuffle className="w-4 h-4 text-[#F1FEC8]" />
                Random Wallpaper
              </button>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Categories
              </div>
              <div className="grid grid-cols-2 gap-1 px-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium ${
                      activeCategory === cat
                        ? 'bg-[#F1FEC8] text-[#090d12] font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar (4th Navbar Inspired) */}
      <div className="lg:hidden fixed bottom-3 left-4 right-4 z-50 bg-[#090d12]/95 border border-slate-800/80 rounded-full shadow-2xl backdrop-blur-2xl px-4 py-2 flex items-center justify-around text-[10px] font-bold text-slate-300">
        <button
          onClick={() => handleNavClick('all')}
          className={`flex flex-col items-center gap-1 ${activeSection === 'all' ? 'text-[#F1FEC8]' : 'hover:text-white'}`}
        >
          <HomeIcon className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('trending')}
          className={`flex flex-col items-center gap-1 ${activeSection === 'trending' ? 'text-[#F1FEC8]' : 'hover:text-white'}`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Trending</span>
        </button>

        <button
          onClick={onSelectRandomWallpaper}
          className="flex flex-col items-center gap-1 hover:text-white"
        >
          <Shuffle className="w-4 h-4 text-[#F1FEC8]" />
          <span>Random</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col items-center gap-1 hover:text-white"
        >
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Explore</span>
        </button>
      </div>
    </>
  );
}