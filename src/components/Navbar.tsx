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
     MOBILE NAV
  ============================================================ */

  const mobileNavContainerRef = useRef<HTMLDivElement | null>(null);

  const [mobileIndicator, setMobileIndicator] = useState({
    index: 0,
    opacity: 1,
    isMoving: false,
    scaleX: 1,
    scaleY: 1,
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
     DESKTOP INDICATOR
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
     MOBILE INDICATOR INDEX
  ============================================================ */

  const getMobileIndex = (id: string) => {
    const index = mobileNavItems.findIndex(
      (item) => item.id === id
    );

    return index >= 0 ? index : 0;
  };

  /* ============================================================
     UPDATE INDICATORS
  ============================================================ */

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

  useEffect(() => {
    const newIndex = getMobileIndex(mobileActiveId);

    setMobileIndicator((prev) => ({
      ...prev,
      index: newIndex,
      opacity: 1,
    }));
  }, [mobileActiveId]);

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
    const newIndex = getMobileIndex(id);
    const oldIndex = mobileIndicator.index;

    const distance = Math.abs(newIndex - oldIndex);

    const stretch =
      distance > 0
        ? Math.min(1.18, 1 + distance * 0.07)
        : 1;

    /* More */
    if (id === 'More') {
      setIsMobileMoreOpen((prev) => !prev);

      setMobileIndicator({
        index: newIndex,
        opacity: 1,
        isMoving: distance > 0,
        scaleX: stretch,
        scaleY: 2 - stretch,
      });

      return;
    }

    /* Random */
    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();

      setIsMobileMoreOpen(false);
    } else {
      onNavChange?.(id);
      setIsMobileMoreOpen(false);
    }

    setMobileIndicator({
      index: newIndex,
      opacity: 1,
      isMoving: distance > 0,
      scaleX: stretch,
      scaleY: 2 - stretch,
    });

    /*
      Small reset after animation.
      Using window.setTimeout avoids the NodeJS Timeout
      type problem.
    */
    window.setTimeout(() => {
      setMobileIndicator((prev) => ({
        ...prev,
        scaleX: 1,
        scaleY: 1,
        isMoving: false,
      }));
    }, 480);
  };

  /* ============================================================
     MOBILE BUBBLE POSITION
  ============================================================ */

  const mobileBubbleStyle: React.CSSProperties = {
    width: '20%',
    left: `${mobileIndicator.index * 20}%`,
    top: '-18px',

    opacity: mobileIndicator.opacity,

    transform: `translate3d(0, 0, 0) scaleX(${mobileIndicator.scaleX}) scaleY(${mobileIndicator.scaleY})`,

    transition:
      'left 480ms cubic-bezier(0.34, 1.45, 0.64, 1), ' +
      'transform 480ms cubic-bezier(0.34, 1.45, 0.64, 1), ' +
      'opacity 250ms ease',

    transformOrigin: 'center center',
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
          MOBILE BOTTOM NAVBAR
      ======================================================== */}

      <div
        className={`
          lg:hidden
          fixed
          bottom-3
          left-3
          right-3
          z-[100]
          max-w-md
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
          ref={mobileNavContainerRef}
          className="
            glass-navbar-dark
            relative
            rounded-full
            px-1.5
            py-1.5
            w-full
            overflow-visible
            isolate
          "
        >
          {/* ==================================================
              LIQUID GLASS ACTIVE BUBBLE
          ================================================== */}

          <div
            aria-hidden="true"
            className="
              absolute
              liquid-bubble-raised-milky
              pointer-events-none
              z-0
              will-change-transform
            "
            style={mobileBubbleStyle}
          />

          {/* ==================================================
              NAV ITEMS
          ================================================== */}

          <div
            className="
              relative
              z-10
              grid
              grid-cols-5
              w-full
            "
          >
            {mobileNavItems.map((item) => {
              const isActive =
                mobileActiveId === item.id;

              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() =>
                    handleMobileNavClick(item.id)
                  }
                  className={`
                    relative
                    min-w-0
                    h-[58px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-full
                    select-none
                    touch-manipulation
                    transition-all
                    duration-300
                    outline-none
                    ${
                      isActive
                        ? 'text-[#23212C] -translate-y-[8px] scale-[1.04]'
                        : 'text-white/80'
                    }
                  `}
                >
                  <Icon
                    className="
                      w-[22px]
                      h-[22px]
                      shrink-0
                      transition-transform
                      duration-300
                    "
                    strokeWidth={
                      isActive ? 2.6 : 2
                    }
                  />

                  <span
                    className="
                      mt-1
                      text-[10px]
                      leading-none
                      font-extrabold
                      tracking-tight
                      whitespace-nowrap
                    "
                  >
                    {item.label}
                  </span>
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
              bottom-[68px]
              left-0
              right-0
              bg-[#23212C]/95
              border
              border-white/10
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
                onClick={() =>
                  setIsMobileMoreOpen(false)
                }
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
                onClick={() =>
                  setIsMobileMoreOpen(false)
                }
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
                onClick={() =>
                  setIsMobileMoreOpen(false)
                }
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
                onClick={() =>
                  setIsMobileMoreOpen(false)
                }
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