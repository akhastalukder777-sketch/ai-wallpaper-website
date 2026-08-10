'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
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

interface IndicatorState {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
  isMoving: boolean;
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
  /* ============================================================
     STATE
  ============================================================ */

  const [isMobileMoreOpen, setIsMobileMoreOpen] =
    useState(false);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState(false);

  const [isSearchExpanded, setIsSearchExpanded] =
    useState(false);

  const [showTopNav, setShowTopNav] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);

  /* ============================================================
     REFS
  ============================================================ */

  const lastScrollY = useRef(0);

  const desktopNavRefs = useRef<
    Map<string, HTMLButtonElement | HTMLDivElement>
  >(new Map());

  const mobileNavRefs =
    useRef<Map<string, HTMLButtonElement>>(new Map());

  const mobileNavContainerRef =
    useRef<HTMLDivElement | null>(null);

  /* ============================================================
     DESKTOP INDICATOR
  ============================================================ */

  const [desktopIndicator, setDesktopIndicator] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
  });

  /* ============================================================
     MOBILE INDICATOR
  ============================================================ */

  const [mobileIndicator, setMobileIndicator] =
    useState<IndicatorState>({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      opacity: 0,
      scaleX: 1,
      scaleY: 1,
      isMoving: false,
    });

  /* ============================================================
     DESKTOP NAV ITEMS
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

  /* ============================================================
     MOBILE NAV ITEMS
  ============================================================ */

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
     MOBILE ACTIVE ITEM

     Latest + Categories live inside More.
     So when those are active, More remains highlighted.
  ============================================================ */

  const getMobileActiveId = useCallback(() => {
    switch (activeNav) {
      case 'Home':
        return 'Home';

      case 'Trending':
        return 'Trending';

      case 'Random':
        return 'Random';

      case 'Saved':
        return 'Saved';

      case 'Latest':
      case 'Categories':
      default:
        return 'More';
    }
  }, [activeNav]);

  /* ============================================================
     SCROLL BEHAVIOR
  ============================================================ */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      /* At top - show everything */
      if (currentScrollY <= 40) {
        setShowTopNav(true);
        setShowBottomNav(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const difference =
        currentScrollY - lastScrollY.current;

      /* Ignore tiny movements */
      if (Math.abs(difference) < 8) {
        return;
      }

      if (difference > 0) {
        /*
          Scrolling DOWN:
          Top navbar hides.
          Bottom navbar stays.
        */
        setShowTopNav(false);
        setShowBottomNav(true);
      } else {
        /*
          Scrolling UP:
          Top navbar shows.
          Bottom navbar hides.
        */
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

  /* ============================================================
     DESKTOP INDICATOR
  ============================================================ */

  const updateDesktopIndicator = useCallback(() => {
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
  }, [activeNav]);

  /* ============================================================
     MOBILE INDICATOR POSITION

     Uses the actual button position relative to the
     mobile navbar container.
  ============================================================ */

  const getMobileButtonPosition = useCallback(
    (id: string) => {
      const button =
        mobileNavRefs.current.get(id);

      const container =
        mobileNavContainerRef.current;

      if (!button || !container) {
        return null;
      }

      const buttonRect =
        button.getBoundingClientRect();

      const containerRect =
        container.getBoundingClientRect();

      return {
        left:
          buttonRect.left -
          containerRect.left,

        top:
          buttonRect.top -
          containerRect.top,

        width: buttonRect.width,
        height: buttonRect.height,
      };
    },
    []
  );

  /* ============================================================
     SET MOBILE INDICATOR
  ============================================================ */

  const moveMobileIndicator = useCallback(
    (
      targetId: string,
      animate = true
    ) => {
      const position =
        getMobileButtonPosition(targetId);

      if (!position) {
        return;
      }

      setMobileIndicator((prev) => {
        const distance = Math.abs(
          position.left - prev.left
        );

        const stretch =
          animate && distance > 10
            ? Math.min(
                1.22,
                1 + distance / 280
              )
            : 1;

        return {
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          opacity: 1,

          scaleX: stretch,
          scaleY:
            animate && distance > 10
              ? 2 - stretch
              : 1,

          isMoving:
            animate && distance > 10,
        };
      });

      if (animate) {
        window.setTimeout(() => {
          setMobileIndicator((prev) => ({
            ...prev,
            scaleX: 1,
            scaleY: 1,
            isMoving: false,
          }));
        }, 450);
      }
    },
    [getMobileButtonPosition]
  );

  /* ============================================================
     UPDATE MOBILE INDICATOR
  ============================================================ */

  const updateMobileIndicator =
    useCallback(
      (animate = false) => {
        const targetId =
          getMobileActiveId();

        moveMobileIndicator(
          targetId,
          animate
        );
      },
      [
        getMobileActiveId,
        moveMobileIndicator,
      ]
    );

  /* ============================================================
     INITIAL + ACTIVE NAV UPDATE
  ============================================================ */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      updateDesktopIndicator();
      updateMobileIndicator(false);
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    activeNav,
    isMobileMoreOpen,
    updateDesktopIndicator,
    updateMobileIndicator,
  ]);

  /* ============================================================
     WINDOW RESIZE
  ============================================================ */

  useEffect(() => {
    const handleResize = () => {
      updateDesktopIndicator();
      updateMobileIndicator(false);
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );
    };
  }, [
    updateDesktopIndicator,
    updateMobileIndicator,
  ]);

  /* ============================================================
     MAIN NAVIGATION
  ============================================================ */

  const handleNavClick = (id: string) => {
    /* Random */
    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();

      setIsMobileMoreOpen(false);
      setIsCategoryDropdownOpen(false);

      return;
    }

    /* More */
    if (id === 'More') {
      setIsMobileMoreOpen((prev) => !prev);
      setIsCategoryDropdownOpen(false);

      return;
    }

    /* Normal navigation */
    onNavChange?.(id);

    setIsMobileMoreOpen(false);

    if (id !== 'Categories') {
      setIsCategoryDropdownOpen(false);
    }
  };

  /* ============================================================
     MOBILE NAV CLICK
  ============================================================ */

  const handleMobileNavClick = (
    id: string
  ) => {
    /* ----------------------------------------------------------
       MORE
    ---------------------------------------------------------- */

    if (id === 'More') {
      const nextState =
        !isMobileMoreOpen;

      setIsMobileMoreOpen(nextState);
      setIsCategoryDropdownOpen(false);

      /*
        More is not a content filter.
        It is only the active mobile menu
        for Latest / Categories.
      */

      requestAnimationFrame(() => {
        moveMobileIndicator(
          'More',
          true
        );
      });

      return;
    }

    /* ----------------------------------------------------------
       RANDOM
    ---------------------------------------------------------- */

    if (id === 'Random') {
      onNavChange?.('Random');
      onRandomClick?.();

      setIsMobileMoreOpen(false);
      setIsCategoryDropdownOpen(false);

      requestAnimationFrame(() => {
        moveMobileIndicator(
          'Random',
          true
        );
      });

      return;
    }

    /* ----------------------------------------------------------
       HOME / TRENDING / SAVED
    ---------------------------------------------------------- */

    onNavChange?.(id);

    setIsMobileMoreOpen(false);
    setIsCategoryDropdownOpen(false);

    requestAnimationFrame(() => {
      moveMobileIndicator(
        id,
        true
      );
    });
  };

  /* ============================================================
     CATEGORY SELECT
  ============================================================ */

  const handleCategorySelect = (
    category: string
  ) => {
    onSelectCategory?.(category);

    /*
      Categories are under More on mobile,
      so active navigation becomes Categories.
    */
    onNavChange?.('Categories');

    setIsCategoryDropdownOpen(false);
    setIsMobileMoreOpen(false);

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

  /* ============================================================
     MOBILE ACTIVE ID
  ============================================================ */

  const mobileActiveId =
    getMobileActiveId();

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
          {/* ====================================================
              SEARCH EXPANDED
          ==================================================== */}

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
              <Search
                className="
                  w-4 h-4
                  text-[#23212C]/70
                  shrink-0
                "
              />

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
                  transition-colors
                "
                aria-label="Close Search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* ==================================================
                  LOGO
              ================================================== */}

              <Link
                href="/"
                onClick={() => {
                  handleNavClick(
                    'Home'
                  );
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
                    w-8 h-8
                    sm:w-9 sm:h-9
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
                      w-full
                      h-full
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

              {/* ==================================================
                  DESKTOP CENTER NAV
              ================================================== */}

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
                {/* Desktop active bubble */}

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
                      desktopIndicator.width,
                    height:
                      desktopIndicator.height,
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
                    const Icon =
                      item.icon;

                    const isActive =
                      activeNav ===
                      item.id;

                    /* ============================
                       CATEGORIES
                    ============================ */

                    if (
                      item.hasDropdown
                    ) {
                      return (
                        <div
                          key={
                            item.id
                          }
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

                            <span>
                              {
                                item.label
                              }
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

                          {/* Category Dropdown */}

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
                                (
                                  cat
                                ) => (
                                  <button
                                    key={
                                      cat
                                    }
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
                                    {
                                      cat
                                    }
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    /* ============================
                       NORMAL DESKTOP ITEM
                    ============================ */

                    return (
                      <button
                        key={
                          item.id
                        }
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

                        <span>
                          {
                            item.label
                          }
                        </span>
                      </button>
                    );
                  }
                )}
              </nav>

              {/* ==================================================
                  RIGHT ACTIONS
              ================================================== */}

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
                {/* Search */}

                <button
                  type="button"
                  onClick={() =>
                    setIsSearchExpanded(
                      true
                    )
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

                {/* Saved */}

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

                  {favoriteCount >
                    0 && (
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
                      {
                        favoriteCount
                      }
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ==========================================================
          MOBILE BOTTOM NAVIGATION
      ========================================================== */}

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
        {/* ========================================================
            MORE DRAWER
        ======================================================== */}

        {isMobileMoreOpen && (
          <div
            className="
              absolute
              bottom-16
              left-0
              right-0
              bg-[#23212C]/96
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
            {/* Drawer Header */}

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
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  p-1
                  text-slate-400
                  hover:text-white
                  transition-colors
                "
                aria-label="Close More"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* More Buttons */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >
              {/* Latest */}

              <button
                type="button"
                onClick={() => {
                  onNavChange?.(
                    'Latest'
                  );

                  setIsMobileMoreOpen(
                    false
                  );

                  requestAnimationFrame(
                    () => {
                      moveMobileIndicator(
                        'More',
                        true
                      );
                    }
                  );

                  window.scrollTo({
                    top: 0,
                    behavior:
                      'smooth',
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

                <span>
                  Latest Pins
                </span>
              </button>

              {/* Categories */}

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
                      moveMobileIndicator(
                        'More',
                        true
                      );

                      document
                        .getElementById(
                          'categories'
                        )
                        ?.scrollIntoView({
                          behavior:
                            'smooth',
                          block:
                            'start',
                        });
                    }
                  );
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

                <span>
                  Categories
                </span>
              </button>
            </div>

            {/* Pages */}

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
              {/* Privacy */}

              <Link
                href="/privacy-policy"
                onClick={() =>
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  hover:text-[#F1FEC8]
                  flex
                  items-center
                  gap-1
                  transition-colors
                "
              >
                <ShieldCheck className="w-3 h-3" />

                Privacy
              </Link>

              {/* Terms */}

              <Link
                href="/terms-of-service"
                onClick={() =>
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  hover:text-[#F1FEC8]
                  flex
                  items-center
                  gap-1
                  transition-colors
                "
              >
                <FileText className="w-3 h-3" />

                Terms
              </Link>

              {/* About */}

              <Link
                href="/about"
                onClick={() =>
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  hover:text-[#F1FEC8]
                  flex
                  items-center
                  gap-1
                  transition-colors
                "
              >
                <Info className="w-3.5 h-3.5" />

                About
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================
            MOBILE BOTTOM NAV CONTAINER
        ======================================================== */}

        <div
          ref={
            mobileNavContainerRef
          }
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
          {/* ======================================================
              MILKY GLASS ACTIVE BUBBLE
          ====================================================== */}

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
                scaleX(
                  ${mobileIndicator.scaleX}
                )
                scaleY(
                  ${mobileIndicator.scaleY}
                )
              `,

              width:
                mobileIndicator.width,

              height:
                mobileIndicator.height,

              opacity:
                mobileIndicator.opacity,

              transformOrigin:
                'center center',

              borderRadius:
                mobileIndicator.isMoving
                  ? '28px 12px 28px 12px'
                  : '9999px',

              transition:
                'transform 450ms cubic-bezier(0.34, 1.45, 0.64, 1), width 450ms cubic-bezier(0.34, 1.45, 0.64, 1), height 450ms cubic-bezier(0.34, 1.45, 0.64, 1), border-radius 450ms ease, opacity 250ms ease',

              pointerEvents:
                'none',
            }}
          />

          {/* ======================================================
              MOBILE NAV ITEMS
          ====================================================== */}

          {mobileNavItems.map(
            (item) => {
              const Icon =
                item.icon;

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
                  onClick={() =>
                    handleMobileNavClick(
                      item.id
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
                    select-none

                    ${
                      isActive
                        ? 'text-[#23212C] font-black'
                        : 'text-slate-300 hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-5
                      h-5
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
                    {
                      item.label
                    }
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