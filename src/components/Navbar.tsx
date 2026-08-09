'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Heart,
  X,
  Flame,
  Grid,
  ChevronDown,
  Dices,
  Home as HomeIcon,
  Clock,
  MoreHorizontal,
  ShieldCheck,
  FileText,
  Info,
} from 'lucide-react';
import { CATEGORIES } from '../data/wallpapers';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  favoriteCount?: number;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  onRandomClick?: () => void;
}

export default function Navbar({
  searchQuery = '',
  onSearchChange,
  favoriteCount = 0,
  activeCategory = 'All',
  onSelectCategory,
  activeNav = 'Home',
  onNavChange,
  onRandomClick,
}: NavbarProps) {
  const [isMobileMoreOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Desktop Liquid Indicator Refs & State
  const desktopNavRefs = useRef<Map<string, HTMLButtonElement | HTMLAnchorElement>>(new Map());
  const [desktopIndicator, setDesktopIndicator] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
    isMoving: false,
  });

  // Mobile Liquid Indicator Refs & State
  const mobileNavRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [mobileIndicator, setMobileIndicator] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
    isMoving: false,
  });

  const desktopNavItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Latest', label: 'Latest', icon: Clock },
    { id: 'Trending', label: 'Trending', icon: Flame, iconColor: 'text-[#090d12]' },
    { id: 'Categories', label: 'Categories', icon: Grid, hasDropdown: true },
    { id: 'Random', label: 'Random', icon: Dices, isAction: true },
  ];

  const mobileNavItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Trending', label: 'Trending', icon: Flame },
    { id: 'Random', label: 'Random', icon: Dices },
    { id: 'Saved', label: 'Saved', icon: Heart },
    { id: 'More', label: 'More', icon: MoreHorizontal },
  ];

  // Recalculate Desktop Liquid Indicator Position
  const updateDesktopIndicator = () => {
    const activeEl = desktopNavRefs.current.get(activeNav);
    if (activeEl) {
      setDesktopIndicator((prev) => ({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        top: activeEl.offsetTop,
        opacity: 1,
        isMoving:
          prev.opacity > 0 &&
          (prev.left !== activeEl.offsetLeft || prev.width !== activeEl.offsetWidth),
      }));
    }
  };

  // Recalculate Mobile Liquid Indicator Position
  const updateMobileIndicator = () => {
    const targetId = activeNav === 'Saved' ? 'Saved' : activeNav === 'Home' || activeNav === 'Trending' || activeNav === 'Random' ? activeNav : 'More';
    const activeBtn = mobileNavRefs.current.get(targetId);
    if (activeBtn) {
      setMobileIndicator((prev) => ({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        height: activeBtn.offsetHeight,
        top: activeBtn.offsetTop,
        opacity: 1,
        isMoving:
          prev.opacity > 0 &&
          (prev.left !== activeBtn.offsetLeft || prev.width !== activeBtn.offsetWidth),
      }));
    }
  };

  useEffect(() => {
    updateDesktopIndicator();
    updateMobileIndicator();

    const timer = setTimeout(() => {
      setDesktopIndicator((prev) => ({ ...prev, isMoving: false }));
      setMobileIndicator((prev) => ({ ...prev, isMoving: false }));
    }, 550);

    const handleResize = () => {
      updateDesktopIndicator();
      updateMobileIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [activeNav]);

  const handleNavClick = (id: string) => {
    if (id === 'Random') {
      if (onRandomClick) onRandomClick();
      return;
    }
    if (id === 'More') {
      setIsMobileMenuOpen(!isMobileMoreOpen);
      return;
    }
    if (onNavChange) onNavChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ================================================== */}
      {/* DESKTOP & TABLET FLOATING CAPSULE NAVBAR (~50% GLASS) */}
      {/* ================================================== */}
      <header className="sticky top-3 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
        <div className="glass-navbar rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xl">
          
          {/* LEFT: Logo & Brand */}
          <Link href="/" onClick={() => handleNavClick('Home')} className="flex items-center gap-2.5 group shrink-0 pr-3 sm:pr-4 border-r border-slate-900/15">
            <div className="w-9 h-9 rounded-full bg-[#090d12] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090d12] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#F1FEC8] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold text-[#090d12] tracking-tight">
                Wallpapers<span className="text-slate-800">.</span>
              </span>
              <span className="hidden xl:block text-[9px] font-bold text-slate-800 uppercase tracking-widest -mt-1">
                4K & Ultra HD
              </span>
            </div>
          </Link>

          {/* CENTER: Floating Navigation with Shared Liquid Active Indicator */}
          <nav className="hidden lg:flex items-center gap-1 relative py-1 px-1">
            {/* Desktop Liquid Active Indicator */}
            <div
              className="absolute bg-[#090d12] shadow-md shadow-black/20 pointer-events-none will-change-transform"
              style={{
                transform: `translate3d(${desktopIndicator.left}px, ${desktopIndicator.top}px, 0) ${
                  desktopIndicator.isMoving ? 'scaleX(1.12) scaleY(0.88)' : 'scale(1)'
                }`,
                width: `${desktopIndicator.width}px`,
                height: `${desktopIndicator.height}px`,
                opacity: desktopIndicator.opacity,
                borderRadius: desktopIndicator.isMoving ? '22px 12px 24px 10px' : '9999px',
                transition:
                  'transform 550ms cubic-bezier(0.34, 1.45, 0.64, 1), width 550ms cubic-bezier(0.34, 1.45, 0.64, 1), height 550ms cubic-bezier(0.34, 1.45, 0.64, 1), border-radius 550ms ease-out, opacity 300ms ease',
              }}
            />

            {desktopNavItems.map((item) => {
              const isActive = activeNav === item.id;
              const Icon = item.icon;

              if (item.hasDropdown) {
                return (
                  <div key={item.id} className="relative">
                    <button
                      ref={(el) => {
                        if (el) desktopNavRefs.current.set(item.id, el);
                        else desktopNavRefs.current.delete(item.id);
                      }}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                        handleNavClick(item.id);
                      }}
                      className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 ${
                        isActive
                          ? 'text-[#F1FEC8]'
                          : 'text-[#090d12]/80 hover:text-[#090d12] hover:bg-slate-900/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Categories Dropdown Menu */}
                    {isCategoryDropdownOpen && (
                      <div className="absolute left-0 mt-3 w-64 bg-[#090d12]/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl p-3 z-50 grid grid-cols-2 gap-1 animate-fade-in">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
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
                                ? 'bg-[#F1FEC8] text-[#090d12] font-bold shadow-md shadow-[#F1FEC8]/20'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-[#F1FEC8]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    if (el) desktopNavRefs.current.set(item.id, el);
                    else desktopNavRefs.current.delete(item.id);
                  }}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 ${
                    isActive
                      ? 'text-[#F1FEC8]'
                      : 'text-[#090d12]/80 hover:text-[#090d12] hover:bg-slate-900/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor || ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Expandable Search & Favorites Counter */}
          <div className="flex items-center gap-2 pl-3 sm:pl-4 border-l border-slate-900/15">
            {/* Expandable Search Input */}
            <div className="relative flex items-center">
              {isSearchExpanded ? (
                <div className="flex items-center gap-1 animate-fade-in bg-white/90 rounded-full border border-slate-900/20 px-3 py-1 shadow-inner">
                  <Search className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search 4K pins..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    className="w-32 sm:w-48 bg-transparent text-xs text-[#090d12] font-medium focus:outline-none placeholder-slate-500"
                  />
                  <button
                    onClick={() => setIsSearchExpanded(false)}
                    className="p-1 rounded-full text-slate-500 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 rounded-full text-[#090d12] hover:bg-slate-900/10 transition-all"
                  aria-label="Expand Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Saved / Favorites Counter Button */}
            <button
              onClick={() => handleNavClick('Saved')}
              className="relative p-2 rounded-full text-[#090d12] hover:bg-slate-900/10 transition-all"
              aria-label="Favorites"
            >
              <Heart className="w-4 h-4" />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#090d12] text-[#F1FEC8] text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* MOBILE FLOATING BOTTOM NAVIGATION BAR (~50% GLASS) */}
      {/* ================================================== */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        <div className="glass-navbar rounded-full px-3 py-2 flex items-center justify-around relative shadow-2xl">
          {/* Mobile Shared Liquid Active Indicator */}
          <div
            className="absolute bg-[#090d12] shadow-md shadow-black/30 pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(${mobileIndicator.left}px, ${mobileIndicator.top}px, 0) ${
                mobileIndicator.isMoving ? 'scaleX(1.15) scaleY(0.85)' : 'scale(1)'
              }`,
              width: `${mobileIndicator.width}px`,
              height: `${mobileIndicator.height}px`,
              opacity: mobileIndicator.opacity,
              borderRadius: mobileIndicator.isMoving ? '22px 12px 24px 10px' : '9999px',
              transition:
                'transform 550ms cubic-bezier(0.34, 1.45, 0.64, 1), width 550ms cubic-bezier(0.34, 1.45, 0.64, 1), height 550ms cubic-bezier(0.34, 1.45, 0.64, 1), border-radius 550ms ease-out, opacity 300ms ease',
            }}
          />

          {mobileNavItems.map((item) => {
            const isActive =
              (activeNav === 'Home' && item.id === 'Home') ||
              (activeNav === 'Trending' && item.id === 'Trending') ||
              (activeNav === 'Random' && item.id === 'Random') ||
              (activeNav === 'Saved' && item.id === 'Saved') ||
              (isMobileMoreOpen && item.id === 'More');

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) mobileNavRefs.current.set(item.id, el);
                  else mobileNavRefs.current.delete(item.id);
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleNavClick(item.id)}
                className={`relative z-10 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-colors duration-200 ${
                  isActive
                    ? 'text-[#F1FEC8] font-bold'
                    : 'text-[#090d12]/80 hover:text-[#090d12]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile "More" Drawer Menu */}
        {isMobileMoreOpen && (
          <div className="absolute bottom-16 left-0 right-0 bg-[#090d12]/95 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-xs space-y-4 animate-fade-in z-50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">More Navigation</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleNavClick('Latest');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <Clock className="w-4 h-4 text-indigo-400" /> Latest Pins
              </button>

              <button
                onClick={() => {
                  handleNavClick('Categories');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <Grid className="w-4 h-4 text-[#F1FEC8]" /> Categories
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <Link href="/privacy-policy" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#F1FEC8] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Privacy
              </Link>
              <Link href="/terms-of-service" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#F1FEC8] flex items-center gap-1">
                <FileText className="w-3 h-3" /> Terms
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#F1FEC8] flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> About
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}