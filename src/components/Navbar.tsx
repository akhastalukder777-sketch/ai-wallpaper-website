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

  // Scroll Direction Auto-Hiding States
  const [showTopNav, setShowTopNav] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);

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

  // Mobile Bottom Magic Circle Indicator Refs & State
  const mobileNavRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [mobileIndicator, setMobileIndicator] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const desktopNavItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Latest', label: 'Latest', icon: Clock },
    { id: 'Trending', label: 'Trending', icon: Flame, iconColor: 'text-[#23212C]' },
    { id: 'Categories', label: 'Categories', icon: Grid, hasDropdown: true },
    { id: 'Random', label: 'Random', icon: Dices },
  ];

  const mobileNavItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Trending', label: 'Trending', icon: Flame },
    { id: 'Random', label: 'Random', icon: Dices },
    { id: 'Saved', label: 'Saved', icon: Heart },
    { id: 'More', label: 'More', icon: MoreHorizontal },
  ];

  // Detect Scroll Direction for Opposite Navbar Hiding/Showing
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setShowTopNav(true);
        setShowBottomNav(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(currentScrollY - lastScrollY.current) < 8) {
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setShowTopNav(false);
        setShowBottomNav(true);
      } else {
        setShowTopNav(true);
        setShowBottomNav(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Recalculate Desktop Indicator
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

  // Recalculate Mobile Bottom Magic Circle Indicator
  const updateMobileIndicator = () => {
    const targetId =
      activeNav === 'Saved'
        ? 'Saved'
        : activeNav === 'Home' || activeNav === 'Trending' || activeNav === 'Random'
        ? activeNav
        : 'More';
    const activeBtn = mobileNavRefs.current.get(targetId);
    if (activeBtn) {
      // Center the 56px circle over the button
      const btnCenter = activeBtn.offsetLeft + activeBtn.offsetWidth / 2;
      setMobileIndicator({
        left: btnCenter - 28, // 28px is half of 56px circle
        width: 56,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updateDesktopIndicator();
    updateMobileIndicator();

    const timer = setTimeout(() => {
      setDesktopIndicator((prev) => ({ ...prev, isMoving: false }));
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

  const handleNavClick = (id: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (onNavChange) onNavChange(id);

    if (id === 'Random') {
      if (onRandomClick) onRandomClick();
    }
    if (id === 'More') {
      setIsMobileMenuOpen(!isMobileMoreOpen);
    } else {
      setIsMobileMenuOpen(false);
    }

    if (e?.currentTarget) {
      const btn = e.currentTarget;
      const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
      setMobileIndicator({
        left: btnCenter - 28,
        width: 56,
        opacity: 1,
      });
    }
  };

  return (
    <>
      {/* ================================================== */}
      {/* FLOATING TOP NAVBAR (DESKTOP & TABLET) */}
      {/* ================================================== */}
      <header
        className={`sticky top-3 z-50 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all duration-300 transform ${
          showTopNav ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <div className="glass-navbar rounded-full px-3.5 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-hidden shadow-xl">
          
          {/* SEARCH ACTIVE STATE ON MOBILE */}
          {isSearchExpanded ? (
            <div className="flex-1 flex items-center gap-2 bg-white/95 rounded-full border border-[#23212C]/20 px-3 py-1.5 shadow-inner transition-all duration-300 w-full overflow-hidden animate-fade-in">
              <Search className="w-4 h-4 text-[#23212C]/70 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search 4K pins, cars, anime..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#23212C] focus:outline-none placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setIsSearchExpanded(false)}
                className="p-1 rounded-full text-[#23212C]/70 hover:text-[#23212C] hover:bg-slate-200 shrink-0"
                aria-label="Close Search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* LEFT: Logo & Brand */}
              <Link
                href="/"
                onClick={() => handleNavClick('Home')}
                className="flex items-center gap-2 group shrink-0 pr-2.5 sm:pr-4 border-r border-[#23212C]/15"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#23212C] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[#23212C] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#F1FEC8] group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <div>
                  <span className="text-sm sm:text-lg font-extrabold text-[#23212C] tracking-tight">
                    Wallpapers<span className="text-slate-800">.</span>
                  </span>
                  <span className="hidden xl:block text-[9px] font-bold text-slate-800 uppercase tracking-widest -mt-1">
                    4K & Ultra HD
                  </span>
                </div>
              </Link>

              {/* CENTER: Floating Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 relative py-1 px-1">
                {/* Desktop Liquid Active Indicator */}
                <div
                  className="absolute bg-[#23212C] shadow-md shadow-black/20 pointer-events-none will-change-transform"
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
                              : 'text-[#23212C]/80 hover:text-[#23212C] hover:bg-slate-900/10'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Categories Dropdown Menu */}
                        {isCategoryDropdownOpen && (
                          <div className="absolute left-0 mt-3 w-64 bg-[#23212C]/95 border border-slate-700/60 rounded-3xl shadow-2xl backdrop-blur-2xl p-3 z-50 grid grid-cols-2 gap-1 animate-fade-in">
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
                                    ? 'bg-[#F1FEC8] text-[#23212C] font-bold shadow-md'
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
                          : 'text-[#23212C]/80 hover:text-[#23212C] hover:bg-slate-900/10'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.iconColor || ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* RIGHT: Search Toggle & Favorites Counter */}
              <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-4 border-l border-[#23212C]/15 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 rounded-full text-[#23212C] hover:bg-slate-900/10 transition-all flex items-center gap-1 text-xs font-bold"
                  aria-label="Search Pins"
                >
                  <Search className="w-4 h-4 text-[#23212C]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('Saved')}
                  className="relative p-2 rounded-full text-[#23212C] hover:bg-slate-900/10 transition-all flex items-center justify-center"
                  aria-label="Favorites"
                >
                  <Heart className="w-4 h-4 text-[#23212C]" />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#23212C] text-[#F1FEC8] text-[9px] font-bold rounded-full flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE FLOATING MAGIC LIQUID NAVBAR (EXACT MATCH TO REFERENCE SCREENSHOT 1) */}
      {/* ========================================================================= */}
      <div
        className={`lg:hidden fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto transition-all duration-300 transform ${
          showBottomNav ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#23212C]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl h-[68px] px-2 flex items-center justify-around relative shadow-2xl">
          
          {/* Exact Raised Floating White/Vanilla Magic Circle Indicator */}
          <div
            className="absolute w-14 h-14 bg-[#F1FEC8] rounded-full border-4 border-[#23212C] shadow-2xl pointer-events-none z-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              transform: `translate3d(${mobileIndicator.left}px, -26px, 0)`,
              opacity: mobileIndicator.opacity,
            }}
          >
            {/* Smooth Concave Liquid Wings Left & Right (Gooey Curve Connection) */}
            <div className="absolute -left-[16px] bottom-[8px] w-4 h-4 bg-transparent rounded-tr-full shadow-[6px_-6px_0_0_#23212C]" />
            <div className="absolute -right-[16px] bottom-[8px] w-4 h-4 bg-transparent rounded-tl-full shadow-[-6px_-6px_0_0_#23212C]" />
          </div>

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
                onClick={(e) => handleNavClick(item.id, e)}
                className="relative z-10 w-1/5 flex flex-col items-center justify-center h-full transition-all duration-300"
              >
                {/* Active Icon moves UP inside the raised circle */}
                <div
                  className={`transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isActive
                      ? '-translate-y-6 text-[#23212C] scale-110'
                      : 'translate-y-0 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Active Label appears under the raised circle inside the bar */}
                <span
                  className={`text-[10px] font-extrabold tracking-tight transition-all duration-300 absolute bottom-2 ${
                    isActive
                      ? 'opacity-100 translate-y-0 text-[#F1FEC8]'
                      : 'opacity-0 translate-y-2 text-slate-400 pointer-events-none'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile "More" Drawer Menu */}
        {isMobileMoreOpen && (
          <div className="absolute bottom-20 left-0 right-0 bg-[#23212C]/95 border border-slate-700/60 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-xs space-y-4 animate-fade-in z-50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">More Navigation</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => {
                  handleNavClick('Latest', e);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800"
              >
                <Clock className="w-4 h-4 text-indigo-400" /> Latest Pins
              </button>

              <button
                onClick={(e) => {
                  handleNavClick('Categories', e);
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