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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const [showTopNav, setShowTopNav] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);

  const lastScrollY = useRef(0);

  /* ============================================================
     DESKTOP INDICATOR
  ============================================================ */

  const desktopNavRefs = useRef<
    Map<string, HTMLButtonElement | HTMLAnchorElement>
  >(new Map());

  const [desktopIndicator, setDesktopIndicator] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
    isMoving: false,
  });

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
     DESKTOP INDICATOR UPDATE
  ============================================================ */

  const updateDesktopIndicator = () => {
    const activeEl = desktopNavRefs.current.get(activeNav);

    if (!activeEl) return;

    setDesktopIndicator((prev) => ({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      top: activeEl.offsetTop,
      opacity: 1,
      isMoving:
        prev.opacity > 0 &&
        (prev.left !== activeEl.offsetLeft ||
          prev.width !== activeEl.offsetWidth),
    }));
  };

  useEffect(() => {
    updateDesktopIndicator();

    const handleResize = () => {
      updateDesktopIndicator();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeNav]);

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
     MOBILE CLICK
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
          DESKTOP / TOP NAVBAR
      ======================================================== */}

      <header
        className={`
          sticky top-3 z-50
          px-2 sm:px-6 lg:px-8
          max-w-7xl mx-auto
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
            glass-navbar
            rounded-full
            px-3.5 sm:px-6
            py-2
            flex
            items-center
            justify-between
            gap-2
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
                px-3
                py-1.5
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
                onChange={(e) =>
                  onSearchChange?.(e.target.value)
                }
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
                "
                aria-label="Close Search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* LOGO */}

              <Link
                href="/"
                onClick={() => handleNavClick('Home')}
                className="
                  flex
                  items-center
                  gap-2
                  group
                  shrink-0
                  pr-2.5
                  sm:pr-4
                  border-r
                  border-[#23212C]/15
                "
              >
                <div
                  className="
                    w-8 h-8
                    sm:w-9 sm:h-9
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
                    <Sparkles
                      className="
                        w-4 h-4
                        text-[#F1FEC8]
                        group-hover:rotate-12
                        transition-transform
                        duration-300
                      "
                    />
                  </div>
                </div>

                <div>
                  <span
                    className="
                      text-sm
                      sm:text-lg
                      font-extrabold
                      text-[#23212C]
                      tracking-tight
                    "
                  >
                    Wallpapers<span className="text-slate-800">.</span>
                  </span>

                  <span
                    className="
                      hidden xl:block
                      text-[9px]
                      font-bold
                      text-slate-800
                      uppercase
                      tracking-widest
                      -mt-1
                    "
                  >
                    4K & Ultra HD
                  </span>
                </div>
              </Link>

              {/* DESKTOP NAV */}

              <nav
                className="
                  hidden
                  lg:flex
                  items-center
                  gap-1
                  relative
                  py-1
                  px-1
                "
              >
                {/* DESKTOP ACTIVE BUBBLE */}

                <div
                  className="
                    absolute
                    bg-[#23212C]
                    shadow-md
                    shadow-black/20
                    pointer-events-none
                    will-change-transform
                  "
                  style={{
                    transform: `translate3d(
                      ${desktopIndicator.left}px,
                      ${desktopIndicator.top}px,
                      0
                    ) ${
                      desktopIndicator.isMoving
                        ? 'scaleX(1.12) scaleY(0.88)'
                        : 'scale(1)'
                    }`,

                    width: desktopIndicator.width,

                    height: desktopIndicator.height,

                    opacity: desktopIndicator.opacity,

                    borderRadius: desktopIndicator.isMoving
                      ? '22px 12px 24px 10px'
                      : '9999px',

                    transition:
                      'transform 550ms cubic-bezier(0.34, 1.45, 0.64, 1), ' +
                      'width 550ms cubic-bezier(0.34, 1.45, 0.64, 1), ' +
                      'height 550ms cubic-bezier(0.34, 1.45, 0.64, 1), ' +
                      'border-radius 550ms ease-out, ' +
                      'opacity 300ms ease',
                  }}
                />

                {desktopNavItems.map((item) => {
                  const isActive = activeNav === item.id;
                  const Icon = item.icon;

                  if (item.hasDropdown) {
                    return (
                      <div
                        key={item.id}
                        className="relative"
                      >
                        <button
                          ref={(el) => {
                            if (el) {
                              desktopNavRefs.current.set(
                                item.id,
                                el
                              );
                            } else {
                              desktopNavRefs.current.delete(
                                item.id
                              );
                            }
                          }}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => {
                            setIsCategoryDropdownOpen(
                              (prev) => !prev
                            );

                            handleNavClick(item.id);
                          }}
                          className={`
                            relative
                            z-10
                            flex
                            items-center
                            gap-1.5
                            px-3.5
                            py-1.5
                            rounded-full
                            text-xs
                            font-bold
                            transition-colors
                            duration-200
                            ${
                              isActive
                                ? 'text-[#F1FEC8]'
                                : 'text-[#23212C]/80 hover:text-[#23212C] hover:bg-slate-900/10'
                            }
                          `}
                        >
                          <Icon className="w-3.5 h-3.5" />

                          <span>{item.label}</span>

                          <ChevronDown
                            className={`
                              w-3 h-3
                              transition-transform
                              duration-200
                              ${
                                isCategoryDropdownOpen
                                  ? 'rotate-180'
                                  : ''
                              }
                            `}
                          />
                        </button>

                        {isCategoryDropdownOpen && (
                          <div
                            className="
                              absolute
                              left-0
                              mt-3
                              w-64
                              bg-[#23212C]/95
                              border
                              border-slate-700/60
                              rounded-3xl
                              shadow-2xl
                              backdrop-blur-2xl
                              p-3
                              z-50
                              grid
                              grid-cols-2
                              gap-1
                            "
                          >
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  onSelectCategory?.(cat);

                                  setIsCategoryDropdownOpen(
                                    false
                                  );

                                  const element =
                                    document.getElementById(
                                      'categories'
                                    );

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
                                  font-medium
                                  transition-all
                                  ${
                                    activeCategory === cat
                                      ? 'bg-[#F1FEC8] text-[#23212C] font-bold shadow-md'
                                      : 'text-slate-300 hover:bg-slate-800 hover:text-[#F1FEC8]'
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
                      ref={(el) => {
                        if (el) {
                          desktopNavRefs.current.set(
                            item.id,
                            el
                          );
                        } else {
                          desktopNavRefs.current.delete(
                            item.id
                          );
                        }
                      }}
                      type="button"
                      aria-current={
                        isActive ? 'page' : undefined
                      }
                      onClick={() =>
                        handleNavClick(item.id)
                      }
                      className={`
                        relative
                        z-10
                        flex
                        items-center
                        gap-1.5
                        px-3.5
                        py-1.5
                        rounded-full
                        text-xs
                        font-bold
                        transition-colors
                        duration-200
                        ${
                          isActive
                            ? 'text-[#F1FEC8]'
                            : 'text-[#23212C]/80 hover:text-[#23212C] hover:bg-slate-900/10'
                        }
                      `}
                    >
                      <item.icon className="w-3.5 h-3.5" />

                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* RIGHT ACTIONS */}

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  sm:gap-2
                  pl-2
                  sm:pl-4
                  border-l
                  border-[#23212C]/15
                  shrink-0
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsSearchExpanded(true)
                  }
                  className="
                    p-2
                    rounded-full
                    text-[#23212C]
                    hover:bg-slate-900/10
                    transition-all
                  "
                  aria-label="Search Pins"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleNavClick('Saved')
                  }
                  className="
                    relative
                    p-2
                    rounded-full
                    text-[#23212C]
                    hover:bg-slate-900/10
                    transition-all
                  "
                  aria-label="Favorites"
                >
                  <Heart className="w-4 h-4" />

                  {favoriteCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-0.5
                        -right-0.5
                        w-4
                        h-4
                        bg-[#23212C]
                        text-[#F1FEC8]
                        text-[9px]
                        font-bold
                        rounded-full
                        flex
                        items-center
                        justify-center
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
          MOBILE BOTTOM FLOATING GLASS NAVBAR (SCREENSHOT 2 EXACT)
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
            h-[74px]
            px-2
            overflow-visible
            isolate
            flex
            items-center
          "
        >
          {/* NAV ITEMS GRID */}

          <div className="grid grid-cols-5 w-full items-center h-full relative z-10">
            {mobileNavItems.map((item) => {
              const isActive = mobileActiveId === item.id;
              const Icon = item.icon;
              const isCenter = item.id === 'Random';

              /* ==================================================
                 CENTER RAISED CIRCLE ITEM (RANDOM)
              ================================================== */
              if (isCenter) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleMobileNavClick(item.id)}
                    className="
                      relative
                      flex
                      flex-col
                      items-center
                      justify-end
                      h-full
                      pb-2.5
                      group
                      focus:outline-none
                    "
                  >
                    {/* RAISED CENTER CIRCLE BUBBLE */}
                    <div
                      className={`
                        center-raised-circle
                        absolute
                        -top-7
                        left-1/2
                        -translate-x-1/2
                        w-[70px]
                        h-[70px]
                        rounded-full
                        flex
                        items-center
                        justify-center
                        z-20
                        transition-transform
                        duration-200
                        ${
                          isActive
                            ? 'scale-105 ring-2 ring-white/90 shadow-xl'
                            : 'active:scale-95 hover:scale-105'
                        }
                      `}
                    >
                      <Icon
                        className="w-6 h-6 text-[#23212C]"
                        strokeWidth={2.4}
                      />
                    </div>

                    {/* LABEL BELOW CIRCLE */}
                    <span
                      className={`
                        text-[11px]
                        font-extrabold
                        tracking-tight
                        transition-colors
                        duration-200
                        z-10
                        mt-auto
                        ${
                          isActive
                            ? 'text-[#23212C]'
                            : 'text-[#23212C]/80 group-hover:text-[#23212C]'
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              }

              /* ==================================================
                 STANDARD NAVIGATION ITEMS
              ================================================== */
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleMobileNavClick(item.id)}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    h-full
                    group
                    focus:outline-none
                    relative
                  "
                >
                  <div
                    className={`
                      flex
                      flex-col
                      items-center
                      justify-center
                      px-3
                      py-1.5
                      rounded-full
                      transition-all
                      duration-250
                      ${
                        isActive
                          ? 'bg-white/40 backdrop-blur-md border border-white/60 shadow-sm text-[#23212C] scale-105'
                          : 'text-[#23212C]/75 hover:text-[#23212C] hover:bg-white/15'
                      }
                    `}
                  >
                    <Icon
                      className="w-5 h-5 shrink-0 transition-transform duration-200"
                      strokeWidth={isActive ? 2.6 : 2}
                    />

                    <span className="mt-0.5 text-[10px] leading-tight font-extrabold tracking-tight">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================
            MORE DRAWER
        ====================================================== */}

        {isMobileMoreOpen && (
          <div
            className="
              absolute
              bottom-[86px]
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
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleNavClick('Latest');
                }}
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
                "
              >
                <Clock className="w-4 h-4" />
                Latest Pins
              </button>

              <button
                type="button"
                onClick={() => {
                  handleNavClick('Categories');
                }}
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