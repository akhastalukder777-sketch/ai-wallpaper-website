'use client';

import React, { useEffect, useState } from 'react';
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
  /* =========================================================
     STATE
  ========================================================= */

  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const [showTopNav, setShowTopNav] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);

  const [mobileMoving, setMobileMoving] = useState(false);

  /* =========================================================
     SCROLL BEHAVIOR
  ========================================================= */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 40) {
        setShowTopNav(true);
        setShowBottomNav(true);
        lastScrollY = currentScrollY;
        return;
      }

      const difference = currentScrollY - lastScrollY;

      if (Math.abs(difference) < 8) {
        return;
      }

      if (difference > 0) {
        // Scroll down
        setShowTopNav(false);
        setShowBottomNav(true);
      } else {
        // Scroll up
        setShowTopNav(true);
        setShowBottomNav(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================================================
     DESKTOP NAV ITEMS
  ========================================================= */

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

  /* =========================================================
     MOBILE NAV ITEMS
  ========================================================= */

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

  /* =========================================================
     MOBILE ACTIVE ITEM
  ========================================================= */

  const getMobileActiveId = () => {
    if (activeNav === 'Home') return 'Home';
    if (activeNav === 'Trending') return 'Trending';
    if (activeNav === 'Random') return 'Random';
    if (activeNav === 'Saved') return 'Saved';

    // Latest / Categories
    return 'More';
  };

  const mobileActiveId = getMobileActiveId();

  const mobileActiveIndex = Math.max(
    0,
    mobileNavItems.findIndex(
      (item) => item.id === mobileActiveId
    )
  );

  /* =========================================================
     MOBILE NAV CLICK
  ========================================================= */

  const handleMobileNavClick = (id: string) => {
    /* -----------------------------
       MORE
    ----------------------------- */

    if (id === 'More') {
      setMobileMoving(false);
      setIsMobileMoreOpen((prev) => !prev);
      return;
    }

    /* -----------------------------
       RANDOM
    ----------------------------- */

    if (id === 'Random') {
      setIsMobileMoreOpen(false);
      setIsCategoryDropdownOpen(false);

      onNavChange?.('Random');
      onRandomClick?.();

      setMobileMoving(true);

      window.setTimeout(() => {
        setMobileMoving(false);
      }, 450);

      return;
    }

    /* -----------------------------
       NORMAL NAV
    ----------------------------- */

    setIsMobileMoreOpen(false);
    setIsCategoryDropdownOpen(false);

    onNavChange?.(id);

    setMobileMoving(true);

    window.setTimeout(() => {
      setMobileMoving(false);
    }, 450);
  };

  /* =========================================================
     DESKTOP NAV CLICK
  ========================================================= */

  const handleDesktopNavClick = (id: string) => {
    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();

      setIsCategoryDropdownOpen(false);
      setIsMobileMoreOpen(false);

      return;
    }

    if (id === 'Categories') {
      setIsCategoryDropdownOpen((prev) => !prev);
      onNavChange?.('Categories');
      return;
    }

    onNavChange?.(id);

    setIsCategoryDropdownOpen(false);
    setIsMobileMoreOpen(false);
  };

  /* =========================================================
     CATEGORY SELECT
  ========================================================= */

  const handleCategorySelect = (category: string) => {
    onSelectCategory?.(category);

    setIsCategoryDropdownOpen(false);
    setIsMobileMoreOpen(false);

    onNavChange?.('Categories');

    requestAnimationFrame(() => {
      document
        .getElementById('categories')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    });
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          TOP / DESKTOP NAVBAR
      ===================================================== */}

      <header
        className={`
          sticky
          top-3
          z-50
          px-2
          sm:px-6
          lg:px-8
          max-w-7xl
          mx-auto
          w-full
          transition-all
          duration-300
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
            px-3.5
            sm:px-6
            py-2
            flex
            items-center
            justify-between
            gap-2
            shadow-xl
          "
        >
          {/* =================================================
              SEARCH EXPANDED
          ================================================= */}

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
                "
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* =================================================
                  LOGO
              ================================================= */}

              <Link
                href="/"
                onClick={() => {
                  onNavChange?.('Home');
                  setIsMobileMoreOpen(false);
                }}
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
                    w-8
                    h-8
                    sm:w-9
                    sm:h-9
                    rounded-full
                    bg-[#23212C]
                    shadow-md
                    group-hover:scale-105
                    transition-transform
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Sparkles
                    className="
                      w-4
                      h-4
                      text-[#F1FEC8]
                      group-hover:rotate-12
                      transition-transform
                    "
                  />
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
                    Wallpapers.
                  </span>

                  <span
                    className="
                      hidden
                      xl:block
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

              {/* =================================================
                  DESKTOP NAV
              ================================================= */}

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
                {desktopNavItems.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    activeNav === item.id;

                  if (item.hasDropdown) {
                    return (
                      <div
                        key={item.id}
                        className="relative"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleDesktopNavClick(
                              item.id
                            )
                          }
                          className={`
                            flex
                            items-center
                            gap-1.5
                            px-3.5
                            py-1.5
                            rounded-full
                            text-xs
                            font-bold
                            transition-all
                            duration-200
                            ${
                              isActive
                                ? 'bg-[#23212C] text-[#F1FEC8]'
                                : 'text-[#23212C]/80 hover:text-[#23212C] hover:bg-slate-900/10'
                            }
                          `}
                        >
                          <Icon className="w-3.5 h-3.5" />

                          <span>
                            {item.label}
                          </span>

                          <ChevronDown
                            className={`
                              w-3 h-3
                              transition-transform
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
                              top-full
                              mt-3
                              w-64
                              bg-[#23212C]/95
                              border
                              border-slate-700/60
                              rounded-3xl
                              shadow-2xl
                              backdrop-blur-2xl
                              p-3
                              z-[100]
                              grid
                              grid-cols-2
                              gap-1
                            "
                          >
                            {CATEGORIES.map(
                              (cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() =>
                                    handleCategorySelect(
                                      cat
                                    )
                                  }
                                  className={`
                                    text-left
                                    px-3
                                    py-2
                                    rounded-xl
                                    text-xs
                                    transition-all
                                    ${
                                      activeCategory ===
                                      cat
                                        ? 'bg-[#F1FEC8] text-[#23212C] font-bold'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-[#F1FEC8]'
                                    }
                                  `}
                                >
                                  {cat}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleDesktopNavClick(
                          item.id
                        )
                      }
                      className={`
                        flex
                        items-center
                        gap-1.5
                        px-3.5
                        py-1.5
                        rounded-full
                        text-xs
                        font-bold
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? 'bg-[#23212C] text-[#F1FEC8]'
                            : 'text-[#23212C]/80 hover:text-[#23212C] hover:bg-slate-900/10'
                        }
                      `}
                    >
                      <item.icon className="w-3.5 h-3.5" />

                      <span>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* =================================================
                  RIGHT ACTIONS
              ================================================= */}

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
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDesktopNavClick('Saved')
                  }
                  className="
                    relative
                    p-2
                    rounded-full
                    text-[#23212C]
                    hover:bg-slate-900/10
                    transition-all
                  "
                  aria-label="Saved favorites"
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

      {/* =======================================================
          MOBILE BOTTOM NAV
      ======================================================= */}

      <div
        className={`
          lg:hidden
          fixed
          bottom-3
          left-3
          right-3
          z-[90]
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
        {/* =====================================================
            MORE MENU
        ===================================================== */}

        {isMobileMoreOpen && (
          <div
            className="
              absolute
              bottom-[76px]
              left-0
              right-0
              bg-[#23212C]/97
              border
              border-slate-700/60
              rounded-3xl
              p-4
              shadow-2xl
              backdrop-blur-2xl
              text-xs
              z-[100]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-800
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
                  p-1
                  text-slate-400
                  hover:text-white
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Latest */}

              <button
                type="button"
                onClick={() => {
                  onNavChange?.('Latest');
                  setIsMobileMoreOpen(false);

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
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
                  hover:bg-slate-800
                  transition-colors
                "
              >
                <Clock className="w-4 h-4" />
                Latest Pins
              </button>

              {/* Categories */}

              <button
                type="button"
                onClick={() => {
                  onNavChange?.('Categories');
                  setIsMobileMoreOpen(false);

                  requestAnimationFrame(() => {
                    document
                      .getElementById('categories')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                  });
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
                  hover:bg-slate-800
                  transition-colors
                "
              >
                <Grid className="w-4 h-4" />
                Categories
              </button>
            </div>

            <div
              className="
                pt-3
                mt-3
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
                  hover:text-[#F1FEC8]
                  flex
                  items-center
                  gap-1
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
                  hover:text-[#F1FEC8]
                  flex
                  items-center
                  gap-1
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
                  hover:text-[#F1FEC8]
                  flex
                  items-center
                  gap-1
                "
              >
                <Info className="w-3 h-3" />
                About
              </Link>
            </div>
          </div>
        )}

        {/* =====================================================
            MOBILE NAV CONTAINER
        ===================================================== */}

        <div
          className="
            glass-navbar-dark
            rounded-full
            p-1.5
            shadow-2xl
            relative
            overflow-hidden
          "
        >
          {/* ===================================================
              LIQUID ACTIVE BUBBLE

              IMPORTANT:
              5 equal columns.
              No offsetLeft.
              No offsetTop.
              No DOM measuring.
          =================================================== */}

          <div
            className={`
              absolute
              top-1.5
              bottom-1.5
              left-1.5
              pointer-events-none
              z-0
              rounded-full
              liquid-bubble-raised-milky
              ${
                mobileMoving
                  ? 'mobile-liquid-moving'
                  : ''
              }
            `}
            style={{
              width: 'calc((100% - 12px) / 5)',
              transform: `translateX(calc(${mobileActiveIndex} * (100% + 3px)))`,
            }}
          />

          {/* ===================================================
              MOBILE BUTTONS
          =================================================== */}

          <div className="relative z-10 grid grid-cols-5 w-full">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                mobileActiveId === item.id;

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
                    h-[62px]
                    px-1
                    rounded-full
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    transition-all
                    duration-300
                    select-none
                    ${
                      isActive
                        ? 'text-[#23212C]'
                        : 'text-slate-300 hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-[21px]
                      h-[21px]
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? 'scale-105'
                          : 'scale-100'
                      }
                    `}
                  />

                  <span
                    className={`
                      text-[10px]
                      leading-none
                      font-extrabold
                      tracking-tight
                      whitespace-nowrap
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? 'opacity-100'
                          : 'opacity-90'
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
      </div>
    </>
  );
}