'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Heart, Menu, X, Flame, Grid, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../data/wallpapers';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  favoriteCount?: number;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function Navbar({
  searchQuery = '',
  onSearchChange,
  favoriteCount = 0,
  activeCategory = 'All',
  onSelectCategory,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#F1FEC8] p-0.5 shadow-lg shadow-[#F1FEC8]/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090d12] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#F1FEC8] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-[#F1FEC8] bg-clip-text text-transparent tracking-tight">
                Wallpapers<span className="text-[#F1FEC8]">.</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-[#F1FEC8] uppercase tracking-widest -mt-1">
                4K & Ultra HD
              </span>
            </div>
          </Link>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search 4K wallpapers, cars, space, nature..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#F1FEC8]/60 focus:ring-1 focus:ring-[#F1FEC8]/60 transition-all"
              />
            </div>
          </div>

          {/* Right Navigation & Favorites */}
          <div className="flex items-center gap-3">
            <a
              href="#trending"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-[#F1FEC8] hover:bg-slate-800/50 rounded-xl transition-all"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              Trending
            </a>

            {/* Categories Dropdown Toggle */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-[#F1FEC8] hover:bg-slate-800/50 rounded-xl transition-all"
              >
                <Grid className="w-4 h-4 text-[#F1FEC8]" />
                Categories
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#090d12]/95 border border-[#F1FEC8]/20 rounded-2xl shadow-2xl backdrop-blur-xl p-2 z-50 grid grid-cols-2 gap-1 animate-fade-in">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(cat);
                        setIsCategoryDropdownOpen(false);
                        const categoriesElement = document.getElementById('categories');
                        if (categoriesElement) {
                          categoriesElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-[#F1FEC8] text-[#090d12] font-bold shadow-md shadow-[#F1FEC8]/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-[#F1FEC8]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites Icon Button */}
            <button
              aria-label="Favorites"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-[#F1FEC8] hover:bg-slate-800/60 transition-all border border-slate-800/80"
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F1FEC8] text-[#090d12] text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 md:hidden border border-slate-800/80"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu Expand */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/60 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search wallpapers..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#F1FEC8]"
              />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href="#trending"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                Trending Wallpapers
              </a>
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Categories
              </div>
              <div className="grid grid-cols-2 gap-1 px-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat);
                      setIsMobileMenuOpen(false);
                      const categoriesElement = document.getElementById('categories');
                      if (categoriesElement) {
                        categoriesElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
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
      </div>
    </header>
  );
}