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
  /* =========================================================
     STATE
  ========================================================= */

  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState(false);

  const [isSearchExpanded, setIsSearchExpanded] =
    useState(false);

  /* Scroll visibility */
  const [showTopNav, setShowTopNav] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);

  const lastScrollY = useRef(0);

  /* =========================================================
     DESKTOP INDICATOR
  ========================================================= */

  const desktopNavRefs = useRef<
    Map<string, HTMLButtonElement | HTMLDivElement>
  >(new Map());

  const [desktopIndicator, setDesktopIndicator] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
  });

  /* =========================================================
     MOBILE INDICATOR
  ========================================================= */

  const mobileNavRefs = useRef<
    Map<string, HTMLButtonElement>
  >(new Map());

  const [mobileIndicator, setMobileIndicator] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
    scaleX: 1,
    scaleY: 1,
    isMoving: false,
  });

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
     SCROLL BEHAVIOR
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 40) {
        setShowTopNav(true);
        setShowBottomNav(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const difference =
        currentScrollY - lastScrollY.current;

      if (Math.abs(difference) < 8) {
        return;
      }

      if (difference > 0) {
        setShowTopNav(false);
        setShowBottomNav(true);
      } else {
        setShowTopNav(true);
        setShowBottomNav(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  /* =========================================================
     DESKTOP INDICATOR
  ========================================================= */

  const updateDesktopIndicator = () => {
    const element =
      desktopNavRefs.current.get(activeNav);

    if (!element) {
      setDesktopIndicator((prev) => ({
        ...prev,
        opacity: 0,
      }));

      return;
    }

    setDesktopIndicator({
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight,
      top: element.offsetTop,
      opacity: 1,
    });
  };

  /* =========================================================
     MOBILE ACTIVE ID
     
     IMPORTANT FIX:
     যখন More drawer open থাকবে,
     More button-ই active থাকবে।
  ========================================================= */

  const getMobileActiveId = () => {
    /*
      FIX:
      More drawer open থাকলে More bubble active থাকবে।
    */
    if (isMobileMoreOpen) {
      return 'More';
    }

    if (activeNav === 'Home') {
      return 'Home';
    }

    if (activeNav === 'Trending') {
      return 'Trending';
    }

    if (activeNav === 'Random') {
      return 'Random';
    }

    if (activeNav === 'Saved') {
      return 'Saved';
    }

    /*
      Latest / Categories are inside More
    */
    if (
      activeNav === 'Latest' ||
      activeNav === 'Categories'
    ) {
      return 'More';
    }

    return 'Home';
  };

  /* =========================================================
     MOBILE INDICATOR
  ========================================================= */

  const updateMobileIndicator = () => {
    const targetId = getMobileActiveId();

    const button =
      mobileNavRefs.current.get(targetId);

    if (!button) {
      return;
    }

    setMobileIndicator((prev) => ({
      ...prev,
      left: button.offsetLeft,
      width: button.offsetWidth,
      height: button.offsetHeight,
      top: button.offsetTop,
      opacity: 1,
    }));
  };

  /* =========================================================
     UPDATE INDICATORS
  ========================================================= */

  useEffect(() => {
    const update = () => {
      updateDesktopIndicator();
      updateMobileIndicator();
    };

    const timer = window.setTimeout(update, 50);

    const handleResize = () => {
      update();
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, [
    activeNav,
    isMobileMoreOpen,
  ]);

  /* =========================================================
     MAIN NAVIGATION HANDLER
  ========================================================= */

  const handleNavClick = (id: string) => {
    /*
      Random
    */
    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();

      setIsMobileMoreOpen(false);
      setIsCategoryDropdownOpen(false);

      return;
    }

    /*
      More
    */
    if (id === 'More') {
      setIsMobileMoreOpen((prev) => !prev);

      return;
    }

    /*
      Normal navigation
    */
    onNavChange?.(id);

    setIsMobileMoreOpen(false);

    if (id !== 'Categories') {
      setIsCategoryDropdownOpen(false);
    }
  };

  /* =========================================================
     MOBILE NAV CLICK
     
     FIXED:
     More button এখন bubble-এর active position
     ঠিকভাবে ধরে রাখবে।
  ========================================================= */

  const handleMobileNavClick = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;

    /* =====================================================
       MORE
    ===================================================== */

    if (id === 'More') {
      const willOpen = !isMobileMoreOpen;

      setIsMobileMoreOpen(willOpen);

      /*
        More button-এ bubble immediately move করবে।
      */
      requestAnimationFrame(() => {
        const target =
          mobileNavRefs.current.get('More');

        if (!target) {
          return;
        }

        setMobileIndicator({
          left: target.offsetLeft,
          width: target.offsetWidth,
          height: target.offsetHeight,
          top: target.offsetTop,
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          isMoving: false,
        });
      });

      return;
    }

    /* =====================================================
       RANDOM
    ===================================================== */

    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();

      setIsMobileMoreOpen(false);
    }

    /* =====================================================
       HOME / TRENDING / SAVED
    ===================================================== */

    else {
      onNavChange?.(id);

      setIsMobileMoreOpen(false);
    }

    /* =====================================================
       LIQUID STRETCH
    ===================================================== */

    const previousLeft =
      mobileIndicator.left;

    const newLeft =
      button.offsetLeft;

    const distance =
      Math.abs(newLeft - previousLeft);

    const stretch =
      distance > 10
        ? Math.min(
            1.20,
            1 + distance / 300
          )
        : 1;

    setMobileIndicator({
      left: newLeft,
      width: button.offsetWidth,
      height: button.offsetHeight,
      top: button.offsetTop,
      opacity: 1,
      scaleX: stretch,
      scaleY: 2 - stretch,
      isMoving: distance > 10,
    });

    window.setTimeout(() => {
      setMobileIndicator((prev) => ({
        ...prev,
        scaleX: 1,
        scaleY: 1,
        isMoving: false,
      }));
    }, 450);
  };

  /* =========================================================
     CATEGORY SELECT
  ========================================================= */

  const handleCategorySelect = (
    category: string
  ) => {
    onSelectCategory?.(category);

    setIsCategoryDropdownOpen(false);
    setIsMobileMoreOpen(false);

    onNavChange?.('Categories');

    requestAnimationFrame(() => {
      const element =
        document.getElementById(
          'categories'
        );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  };

  /* =========================================================
     MOBILE ACTIVE
  ========================================================= */

  const mobileActiveId =
    getMobileActiveId();

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          DESKTOP / TOP NAVBAR
      ===================================================== */}

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
            flex items-center
            justify-between
            gap-2
            overflow-visible
            shadow-xl
          "
        >
          {/* =================================================
              MOBILE SEARCH
          ================================================= */}

          {isSearchExpanded ? (
            <div
              className="
                flex-1 flex items-center gap-2
                bg-white/95
                rounded-full
                border border-[#23212C]/20
                px-3 py-1.5
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
                  onSearchChange?.(
                    e.target.value
                  )
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
                onClick={() =>
                  setIsSearchExpanded(false)
                }
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
              {/* =================================================
                  LOGO
              ================================================= */}

              <Link
                href="/"
                onClick={() =>
                  handleNavClick('Home')
                }
                className="
                  flex items-center gap-2
                  group shrink-0
                  pr-2.5 sm:pr-4
                  border-r border-[#23212C]/15
                "
              >
                <div
                  className="
                    w-8 h-8 sm:w-9 sm:h-9
                    rounded-full
                    bg-[#23212C]
                    p-0.5
                    shadow-md
                    group-hover:scale-105
                    transition-transform
                  "
                >
                  <div
                    className="
                      w-full h-full
                      bg-[#23212C]
                      rounded-full
                      flex items-center justify-center
                    "
                  >
                    <Sparkles
                      className="
                        w-4 h-4
                        text-[#F1FEC8]
                        group-hover:rotate-12
                        transition-transform
                      "
                    />
                  </div>
                </div>

                <div>
                  <span
                    className="
                      text-sm sm:text-lg
                      font-extrabold
                      text-[#23212C]
                      tracking-tight
                    "
                  >
                    Wallpapers.
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

              {/* =================================================
                  DESKTOP CENTER NAV
              ================================================= */}

              <nav
                className="
                  hidden lg:flex
                  items-center
                  gap-1
                  relative
                  py-1 px-1
                "
              >
                {/* DESKTOP LIQUID INDICATOR */}

                <div
                  className="
                    absolute
                    bg-[#23212C]
                    shadow-md
                    shadow-black/20
                    pointer-events-none
                    z-0
                  "
                  style={{
                    transform: `
                      translate3d(
                        ${desktopIndicator.left}px,
                        ${desktopIndicator.top}px,
                        0
                      )
                    `,

                    width:
                      `${desktopIndicator.width}px`,

                    height:
                      `${desktopIndicator.height}px`,

                    opacity:
                      desktopIndicator.opacity,

                    borderRadius:
                      '9999px',

                    transition:
                      'all 450ms cubic-bezier(0.34, 1.45, 0.64, 1)',
                  }}
                />

                {desktopNavItems.map(
                  (item) => {
                    const Icon = item.icon;

                    const isActive =
                      activeNav === item.id;

                    if (
                      item.hasDropdown
                    ) {
                      return (
                        <div
                          key={item.id}
                          className="relative"
                          ref={(el) => {
                            if (el) {
                              desktopNavRefs.current.set(
                                item.id,
                                el
                              );
                            }
                          }}
                        >
                          <button
                            type="button"
                            aria-pressed={
                              isActive
                            }
                            onClick={() => {
                              setIsCategoryDropdownOpen(
                                (prev) =>
                                  !prev
                              );

                              onNavChange?.(
                                'Categories'
                              );
                            }}
                            className={`
                              relative z-10
                              flex items-center gap-1.5
                              px-3.5 py-1.5
                              rounded-full
                              text-xs font-bold
                              transition-colors duration-200
                              ${
                                isActive
                                  ? 'text-[#F1FEC8]'
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
                                border border-slate-700/60
                                rounded-3xl
                                shadow-2xl
                                backdrop-blur-2xl
                                p-3
                                z-[100]
                                grid grid-cols-2
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
                                      px-3 py-2
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
                          isActive
                            ? 'page'
                            : undefined
                        }
                        onClick={() =>
                          handleNavClick(
                            item.id
                          )
                        }
                        className={`
                          relative z-10
                          flex items-center gap-1.5
                          px-3.5 py-1.5
                          rounded-full
                          text-xs font-bold
                          transition-colors duration-200
                          ${
                            isActive
                              ? 'text-[#F1FEC8]'
                              : 'text-[#23212C]/80 hover:text-[#23212C] hover:bg-slate-900/10'
                          }
                        `}
                      >
                        <Icon className="w-3.5 h-3.5" />

                        <span>
                          {item.label}
                        </span>
                      </button>
                    );
                  }
                )}
              </nav>

              {/* =================================================
                  RIGHT ACTIONS
              ================================================= */}

              <div
                className="
                  flex items-center
                  gap-1.5 sm:gap-2
                  pl-2 sm:pl-4
                  border-l border-[#23212C]/15
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
                    handleNavClick(
                      'Saved'
                    )
                  }
                  className="
                    relative
                    p-2
                    rounded-full
                    text-[#23212C]
                    hover:bg-slate-900/10
                    transition-all
                  "
                  aria-label="Saved Favorites"
                >
                  <Heart className="w-4 h-4" />

                  {favoriteCount > 0 && (
                    <span
                      className="
                        absolute
                        -top-0.5
                        -right-0.5
                        w-4 h-4
                        bg-[#23212C]
                        text-[#F1FEC8]
                        text-[9px]
                        font-bold
                        rounded-full
                        flex items-center justify-center
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
          MOBILE BOTTOM NAVBAR
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
          transition-all duration-300
          ${
            showBottomNav
              ? 'translate-y-0 opacity-100'
              : 'translate-y-28 opacity-0 pointer-events-none'
          }
        `}
      >
        {/* =====================================================
            MORE DRAWER
        ===================================================== */}

        {isMobileMoreOpen && (
          <div
            className="
              absolute
              bottom-16
              left-0
              right-0
              bg-[#23212C]/96
              border border-slate-700/60
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
                flex items-center
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
                  setIsMobileMoreOpen(
                    false
                  )
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
              <button
                type="button"
                onClick={() => {
                  onNavChange?.(
                    'Latest'
                  );

                  setIsMobileMoreOpen(
                    false
                  );

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
                className="
                  flex items-center gap-2
                  p-3
                  rounded-xl
                  bg-slate-900
                  border border-slate-800
                  text-slate-200
                  hover:bg-slate-800
                  transition-colors
                "
              >
                <Clock className="w-4 h-4" />
                Latest Pins
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavChange?.(
                    'Categories'
                  );

                  setIsMobileMoreOpen(
                    false
                  );

                  requestAnimationFrame(
                    () => {
                      document
                        .getElementById(
                          'categories'
                        )
                        ?.scrollIntoView({
                          behavior:
                            'smooth',
                        });
                    }
                  );
                }}
                className="
                  flex items-center gap-2
                  p-3
                  rounded-xl
                  bg-slate-900
                  border border-slate-800
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
                flex flex-wrap
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
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  hover:text-[#F1FEC8]
                  flex items-center gap-1
                "
              >
                <ShieldCheck className="w-3 h-3" />
                Privacy
              </Link>

              <Link
                href="/terms-of-service"
                onClick={() =>
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  hover:text-[#F1FEC8]
                  flex items-center gap-1
                "
              >
                <FileText className="w-3 h-3" />
                Terms
              </Link>

              <Link
                href="/about"
                onClick={() =>
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  hover:text-[#F1FEC8]
                  flex items-center gap-1
                "
              >
                <Info className="w-3.5 h-3.5" />
                About
              </Link>
            </div>
          </div>
        )}

        {/* =====================================================
            MOBILE BOTTOM NAV
        ===================================================== */}

        <div
          className="
            glass-navbar-dark
            rounded-full
            px-2
            py-1.5
            flex
            items-center
            justify-around
            relative
            shadow-2xl
            overflow-hidden
          "
        >
          {/* ===================================================
              MILKY LIQUID ACTIVE BUBBLE
          =================================================== */}

          <div
            className="
              absolute
              liquid-bubble-raised-milky
              pointer-events-none
              will-change-transform
              z-0
            "
            style={{
              transform: `
                translate3d(
                  ${mobileIndicator.left}px,
                  ${mobileIndicator.top}px,
                  0
                )
                scaleX(${mobileIndicator.scaleX})
                scaleY(${mobileIndicator.scaleY})
              `,

              width:
                `${mobileIndicator.width}px`,

              height:
                `${mobileIndicator.height}px`,

              opacity:
                mobileIndicator.opacity,

              borderRadius:
                mobileIndicator.isMoving
                  ? '28px 12px 28px 12px'
                  : '9999px',

              transition:
                'transform 450ms cubic-bezier(0.34, 1.45, 0.64, 1), width 450ms cubic-bezier(0.34, 1.45, 0.64, 1), height 450ms cubic-bezier(0.34, 1.45, 0.64, 1), border-radius 450ms ease, opacity 250ms ease',
            }}
          />

          {/* ===================================================
              MOBILE ITEMS
          =================================================== */}

          {mobileNavItems.map(
            (item) => {
              const Icon = item.icon;

              const isActive =
                mobileActiveId ===
                item.id;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    if (el) {
                      mobileNavRefs.current.set(
                        item.id,
                        el
                      );
                    } else {
                      mobileNavRefs.current.delete(
                        item.id
                      );
                    }
                  }}
                  type="button"
                  aria-pressed={
                    isActive
                  }
                  onClick={(event) =>
                    handleMobileNavClick(
                      item.id,
                      event
                    )
                  }
                  className={`
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-0.5
                    px-3
                    py-1.5
                    min-w-[58px]
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? 'text-[#23212C] font-black'
                        : 'text-slate-300 hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-5 h-5
                      transition-transform
                      duration-300
                      ${
                        isActive
                          ? 'scale-105'
                          : ''
                      }
                    `}
                  />

                  <span
                    className="
                      text-[10px]
                      font-extrabold
                      tracking-tight
                      whitespace-nowrap
                    "
                  >
                    {item.label}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}