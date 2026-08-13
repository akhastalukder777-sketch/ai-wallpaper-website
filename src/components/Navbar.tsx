'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const [showTopNav, setShowTopNav] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);

  const lastScrollY = useRef(0);

  /* ============================================================
     NAV ITEMS
  ============================================================ */

  const desktopNavItems = [
    {
      id: 'Home',
      label: 'Home',
      icon: HomeIcon,
    },
    {
      id: 'Latest',
      label: 'Latest',
      icon: Clock,
    },
    {
      id: 'Trending',
      label: 'Trending',
      icon: Flame,
    },
    {
      id: 'Categories',
      label: 'Categories',
      icon: Grid,
      hasDropdown: true,
    },
    {
      id: 'Random',
      label: 'Random',
      icon: Dices,
    },
  ];

  const mobileNavItems = [
    {
      id: 'Home',
      label: 'Home',
      icon: HomeIcon,
    },
    {
      id: 'Trending',
      label: 'Trending',
      icon: Flame,
    },
    {
      id: 'Random',
      label: 'Random',
      icon: Dices,
    },
    {
      id: 'Saved',
      label: 'Saved',
      icon: Heart,
    },
    {
      id: 'More',
      label: 'More',
      icon: MoreHorizontal,
    },
  ];

  /* ============================================================
     SCROLL BEHAVIOR
  ============================================================ */

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
        // Scroll DOWN
        setShowTopNav(false);
        setShowBottomNav(true);
      } else {
        // Scroll UP
        setShowTopNav(true);
        setShowBottomNav(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* ============================================================
     MOBILE ACTIVE ID
  ============================================================ */

  const getMobileActiveId = () => {
    if (isMobileMoreOpen) {
      return 'More';
    }

    if (
      activeNav === 'Home' ||
      activeNav === 'Trending' ||
      activeNav === 'Random' ||
      activeNav === 'Saved'
    ) {
      return activeNav;
    }

    return 'More';
  };

  const mobileActiveId = getMobileActiveId();

  const mobileActiveIndex = Math.max(
    0,
    mobileNavItems.findIndex((item) => item.id === mobileActiveId)
  );

  /* ============================================================
     NAV CLICK
  ============================================================ */

  const handleNavClick = (id: string) => {
    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();

      setIsMobileMoreOpen(false);
      setIsCategoryDropdownOpen(false);

      return;
    }

    if (id === 'More') {
      setIsMobileMoreOpen((prev) => !prev);
      return;
    }

    onNavChange?.(id);

    setIsMobileMoreOpen(false);

    if (id !== 'Categories') {
      setIsCategoryDropdownOpen(false);
    }
  };

  /* ============================================================
     MOBILE NAV CLICK
  ============================================================ */

  const handleMobileNavClick = (id: string) => {
    if (id === 'More') {
      setIsMobileMoreOpen((prev) => !prev);
      return;
    }

    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();
      setIsMobileMoreOpen(false);
    } else {
      onNavChange?.(id);
      setIsMobileMoreOpen(false);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* ========================================================
          DESKTOP / TOP GLASS CAPSULE NAVBAR (SCREENSHOT 2)
      ======================================================== */}

      <header
        className={`
          sticky top-3 z-50
          px-2 sm:px-6 lg:px-8
          max-w-6xl mx-auto
          w-full
          transition-all duration-300
          transform
          ${
            showTopNav
              ? 'translate-y-0 opacity-100'
              : '-translate-y-24 opacity-0 pointer-events-none'
          }
        `}
      >
        <div
          className="
            glass-navbar-desktop
            rounded-full
            px-4 sm:px-5
            py-2.5
            flex
            items-center
            justify-between
            gap-3
            overflow-visible
            shadow-xl
          "
        >
          {/* SEARCH EXPANDED */}

          {isSearchExpanded ? (
            <div
              className="
                flex-1
                flex
                items-center
                gap-2
                bg-white/95
                rounded-full
                border
                border-[#23212C]/20
                px-4
                py-2
                shadow-inner
                w-full
                overflow-hidden
              "
            >
              <Search className="w-4 h-4 text-[#23212C]/70 shrink-0" />

              <input
                type="text"
                autoFocus
                placeholder="Search 4K pins, cars, anime..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="
                  w-full
                  bg-transparent
                  text-xs
                  font-bold
                  text-[#23212C]
                  outline-none
                  placeholder-slate-500
                "
              />

              <button
                type="button"
                onClick={() => setIsSearchExpanded(false)}
                className="
                  p-1
                  rounded-full
                  text-[#23212C]/70
                  hover:text-[#23212C]
                  hover:bg-slate-200
                  shrink-0
                  cursor-pointer
                "
                aria-label="Close Search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* LOGO AREA */}

              <Link
                href="/"
                onClick={() => handleNavClick('Home')}
                className="
                  flex
                  items-center
                  gap-2.5
                  group
                  shrink-0
                  pr-3
                "
              >
                <div
                  className="
                    w-9 h-9
                    rounded-full
                    bg-[#23212C]
                    p-0.5
                    shadow-md
                    group-hover:scale-105
                    transition-transform
                    duration-300
                  "
                >
                  <div
                    className="
                      w-full h-full
                      bg-[#23212C]
                      rounded-full
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Sparkles className="w-4 h-4 text-[#F1FEC8]" />
                  </div>
                </div>

                <div>
                  <span className="text-base sm:text-lg font-extrabold text-[#23212C] tracking-tight">
                    Wallpapers<span className="text-slate-800">.</span>
                  </span>
                  <span className="hidden xl:block text-[9px] font-bold text-slate-700 uppercase tracking-widest -mt-1">
                    4K & Ultra HD
                  </span>
                </div>
              </Link>

              {/* DESKTOP NAV CHIPS (SCREENSHOT 2 INDIVIDUAL FLOATING PILLS) */}

              <nav className="hidden lg:flex items-center gap-2 relative">
                {desktopNavItems.map((item) => {
                  const isActive = activeNav === item.id;
                  const Icon = item.icon;

                  if (item.hasDropdown) {
                    return (
                      <div key={item.id} className="relative">
                        <button
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => {
                            setIsCategoryDropdownOpen((prev) => !prev);
                            handleNavClick(item.id);
                          }}
                          className={`
                            px-4 py-2
                            rounded-full
                            text-xs
                            font-extrabold
                            flex
                            items-center
                            gap-2
                            cursor-pointer
                            ${
                              isActive
                                ? 'nav-pill-chip-active'
                                : 'nav-pill-chip'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isCategoryDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isCategoryDropdownOpen && (
                          <div
                            className="
                              absolute
                              left-0
                              mt-3
                              w-64
                              bg-white/95
                              border
                              border-white
                              rounded-3xl
                              shadow-2xl
                              backdrop-blur-2xl
                              p-3
                              z-50
                              grid
                              grid-cols-2
                              gap-1.5
                            "
                          >
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  onSelectCategory?.(cat);
                                  setIsCategoryDropdownOpen(false);
                                  const element =
                                    document.getElementById('categories');
                                  element?.scrollIntoView({
                                    behavior: 'smooth',
                                  });
                                }}
                                className={`
                                  text-left
                                  px-3
                                  py-2
                                  rounded-xl
                                  text-xs
                                  font-bold
                                  cursor-pointer
                                  transition-all
                                  ${
                                    activeCategory === cat
                                      ? 'bg-[#23212C] text-[#F1FEC8] shadow-md'
                                      : 'text-[#23212C] hover:bg-slate-100'
                                  }
                                `}
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
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        px-4 py-2
                        rounded-full
                        text-xs
                        font-extrabold
                        flex
                        items-center
                        gap-2
                        cursor-pointer
                        ${
                          isActive
                            ? 'nav-pill-chip-active'
                            : 'nav-pill-chip'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* RIGHT ACTIONS (SEARCH / FAVORITES GLASS BUTTONS) */}

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(true)}
                  className="
                    glass-icon-btn
                    w-9 h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                  "
                  aria-label="Search Pins"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('Saved')}
                  className="
                    glass-icon-btn
                    relative
                    w-9 h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                  "
                  aria-label="Favorites"
                >
                  <Heart className="w-4 h-4" />

                  {favoriteCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-1
                        -right-1
                        w-4.5
                        h-4.5
                        bg-[#23212C]
                        text-[#F1FEC8]
                        text-[9px]
                        font-extrabold
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shadow-md
                      "
                    >
                      {favoriteCount}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ========================================================
          MOBILE BOTTOM FLOATING GLASS NAVBAR
      ======================================================== */}

      <div
        className={`
          lg:hidden
          fixed
          bottom-[calc(16px+env(safe-area-inset-bottom))]
          left-0
          right-0
          z-[100]
          w-[92%]
          max-w-[420px]
          mx-auto
          transition-all
          duration-300
          ${
            showBottomNav
              ? 'translate-y-0 opacity-100'
              : 'translate-y-28 opacity-0 pointer-events-none'
          }
        `}
      >
        <div
          className="
            glass-navbar-floating
            relative
            rounded-full
            w-full
            h-[78px]
            px-2
            overflow-visible
            isolate
            flex
            items-center
          "
        >
          {/* MOBILE NAV GRID */}

          <div
            className="
              grid
              grid-cols-5
              w-full
              h-full
              items-center
              relative
            "
          >
            {/* SINGLE MOVING ACTIVE INDICATOR */}

            <div
              className="
                mobile-active-indicator
                absolute
                top-1/2
                w-[68px]
                h-[62px]
                rounded-full
                pointer-events-none
                z-0
              "
              style={{
                left: `${mobileActiveIndex * 20 + 10}%`,
              }}
            />

            {mobileNavItems.map((item) => {
              const isActive = mobileActiveId === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleMobileNavClick(item.id)}
                  className={`
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                    justify-center
                    h-full
                    min-w-0
                    group
                    focus:outline-none
                    rounded-full
                    cursor-pointer
                    transition-transform
                    duration-200
                    ${
                      isActive
                        ? 'text-[#23212C]'
                        : 'text-[#23212C]/75'
                    }
                  `}
                >
                  <Icon
                    className="
                      w-[25px]
                      h-[25px]
                      shrink-0
                      transition-all
                      duration-300
                    "
                    strokeWidth={isActive ? 2.6 : 2.1}
                  />

                  <span
                    className={`
                      mt-1
                      text-[12px]
                      leading-none
                      font-extrabold
                      tracking-tight
                      whitespace-nowrap
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? 'text-[#23212C]'
                          : 'text-[#23212C]/75'
                      }
                    `}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MORE DRAWER */}

        {isMobileMoreOpen && (
          <div
            className="
              absolute
              bottom-[90px]
              left-0
              right-0
              bg-[#23212C]/95
              border
              border-white/20
              rounded-3xl
              p-4
              shadow-2xl
              backdrop-blur-2xl
              text-xs
              z-[110]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/10
                pb-3
                mb-3
              "
            >
              <span
                className="
                  font-bold
                  text-white
                  uppercase
                  tracking-wider
                  text-[11px]
                "
              >
                More Navigation
              </span>

              <button
                type="button"
                onClick={() => setIsMobileMoreOpen(false)}
                className="
                  p-1.5
                  text-slate-400
                  hover:text-white
                  rounded-full
                  cursor-pointer
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('Latest')}
                className="
                  flex
                  items-center
                  gap-2
                  p-3
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                  text-slate-200
                  cursor-pointer
                "
              >
                <Clock className="w-4 h-4" />
                Latest Pins
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('Categories')}
                className="
                  flex
                  items-center
                  gap-2
                  p-3
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                  text-slate-200
                  cursor-pointer
                "
              >
                <Grid className="w-4 h-4" />
                Categories
              </button>
            </div>

            <div
              className="
                mt-3
                pt-3
                border-t
                border-slate-800/80
                flex
                flex-wrap
                items-center
                justify-between
                text-[11px]
                text-slate-400
                gap-3
              "
            >
              <Link
                href="/privacy-policy"
                onClick={() => setIsMobileMoreOpen(false)}
                className="
                  flex
                  items-center
                  gap-1
                  hover:text-[#F1FEC8]
                "
              >
                <ShieldCheck className="w-3 h-3" />
                Privacy
              </Link>

              <Link
                href="/terms-of-service"
                onClick={() => setIsMobileMoreOpen(false)}
                className="
                  flex
                  items-center
                  gap-1
                  hover:text-[#F1FEC8]
                "
              >
                <FileText className="w-3 h-3" />
                Terms
              </Link>

              <Link
                href="/about"
                onClick={() => setIsMobileMoreOpen(false)}
                className="
                  flex
                  items-center
                  gap-1
                  hover:text-[#F1FEC8]
                "
              >
                <Info className="w-3.5 h-3.5" />
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}