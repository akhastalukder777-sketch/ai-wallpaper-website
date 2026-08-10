"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";

import Link from "next/link";

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
} from "lucide-react";

import { CATEGORIES } from "../data/wallpapers";

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
  moving: boolean;
}

export default function Navbar({
  searchQuery = "",
  onSearchChange,
  favoriteCount = 0,
  activeCategory = "All",
  onSelectCategory,
  activeNav = "Home",
  onNavChange,
  onRandomClick,
}: NavbarProps) {
  /* ======================================================
     STATES
  ====================================================== */

  const [isMobileMoreOpen, setIsMobileMoreOpen] =
    useState(false);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState(false);

  const [isSearchExpanded, setIsSearchExpanded] =
    useState(false);

  /* ======================================================
     SCROLL STATES
  ====================================================== */

  const [showTopNav, setShowTopNav] = useState(true);

  const [showBottomNav, setShowBottomNav] = useState(true);

  const lastScrollY = useRef(0);

  /* ======================================================
     MOBILE NAV REFS
  ====================================================== */

  const mobileNavContainerRef =
    useRef<HTMLDivElement | null>(null);

  const mobileNavRefs =
    useRef<Map<string, HTMLButtonElement>>(
      new Map()
    );

  /* ======================================================
     MOBILE LIQUID INDICATOR
  ====================================================== */

  const [mobileIndicator, setMobileIndicator] =
    useState<IndicatorState>({
      left: 0,
      top: 0,
      width: 58,
      height: 58,
      opacity: 0,
      moving: false,
    });

  /* ======================================================
     DESKTOP REFS
  ====================================================== */

  const desktopNavRefs =
    useRef<Map<string, HTMLButtonElement>>(
      new Map()
    );

  const [desktopIndicator, setDesktopIndicator] =
    useState({
      left: 0,
      width: 0,
      height: 0,
      top: 0,
      opacity: 0,
      moving: false,
    });

  /* ======================================================
     NAV ITEMS
  ====================================================== */

  const desktopNavItems = [
    {
      id: "Home",
      label: "Home",
      icon: HomeIcon,
    },

    {
      id: "Latest",
      label: "Latest",
      icon: Clock,
    },

    {
      id: "Trending",
      label: "Trending",
      icon: Flame,
    },

    {
      id: "Categories",
      label: "Categories",
      icon: Grid,
      hasDropdown: true,
    },

    {
      id: "Random",
      label: "Random",
      icon: Dices,
    },
  ];

  const mobileNavItems = [
    {
      id: "Home",
      label: "Home",
      icon: HomeIcon,
    },

    {
      id: "Trending",
      label: "Trending",
      icon: Flame,
    },

    {
      id: "Random",
      label: "Random",
      icon: Dices,
    },

    {
      id: "Saved",
      label: "Saved",
      icon: Heart,
    },

    {
      id: "More",
      label: "More",
      icon: MoreHorizontal,
    },
  ];

  /* ======================================================
     MOBILE ACTIVE ITEM
  ====================================================== */

  const getMobileActiveId = () => {
    if (isMobileMoreOpen) {
      return "More";
    }

    if (
      activeNav === "Home" ||
      activeNav === "Trending" ||
      activeNav === "Random" ||
      activeNav === "Saved"
    ) {
      return activeNav;
    }

    return "Home";
  };

  /* ======================================================
     UPDATE MOBILE LIQUID BUBBLE
     
     IMPORTANT:
     We calculate the position using getBoundingClientRect()
     instead of offsetLeft.

     This fixes the misplaced bubble problem.
  ====================================================== */

  const updateMobileIndicator = (
    animate = false
  ) => {
    const container =
      mobileNavContainerRef.current;

    const activeId = getMobileActiveId();

    const button =
      mobileNavRefs.current.get(activeId);

    if (!container || !button) {
      return;
    }

    const containerRect =
      container.getBoundingClientRect();

    const buttonRect =
      button.getBoundingClientRect();

    const bubbleSize = 58;

    const buttonCenter =
      buttonRect.left +
      buttonRect.width / 2;

    const left =
      buttonCenter -
      containerRect.left -
      bubbleSize / 2;

    /*
      Bubble sits slightly above the navigation button.
    */

    const top =
      buttonRect.top -
      containerRect.top +
      buttonRect.height / 2 -
      bubbleSize / 2 -
      3;

    setMobileIndicator((previous) => ({
      left,
      top,
      width: bubbleSize,
      height: bubbleSize,
      opacity: 1,
      moving: animate,
    }));
  };

  /* ======================================================
     INITIAL / ACTIVE NAV UPDATE
  ====================================================== */

  useLayoutEffect(() => {
    const timer = requestAnimationFrame(() => {
      updateMobileIndicator(false);
    });

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [
    activeNav,
    isMobileMoreOpen,
  ]);

  /* ======================================================
     WINDOW RESIZE
  ====================================================== */

  useEffect(() => {
    const handleResize = () => {
      updateMobileIndicator(false);
      updateDesktopIndicator();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  });

  /* ======================================================
     DESKTOP INDICATOR
  ====================================================== */

  const updateDesktopIndicator = () => {
    const activeElement =
      desktopNavRefs.current.get(activeNav);

    if (!activeElement) {
      return;
    }

    setDesktopIndicator((previous) => ({
      left: activeElement.offsetLeft,
      width: activeElement.offsetWidth,
      height: activeElement.offsetHeight,
      top: activeElement.offsetTop,
      opacity: 1,
      moving:
        previous.opacity > 0 &&
        previous.left !==
          activeElement.offsetLeft,
    }));
  };

  useLayoutEffect(() => {
    const timer = requestAnimationFrame(() => {
      updateDesktopIndicator();
    });

    return () => {
      cancelAnimationFrame(timer);
    };
  }, [activeNav]);

  /* ======================================================
     SCROLL DIRECTION
  ====================================================== */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY =
        window.scrollY;

      if (currentScrollY < 50) {
        setShowTopNav(true);
        setShowBottomNav(true);

        lastScrollY.current =
          currentScrollY;

        return;
      }

      if (
        Math.abs(
          currentScrollY -
            lastScrollY.current
        ) < 8
      ) {
        return;
      }

      if (
        currentScrollY >
        lastScrollY.current
      ) {
        /*
          Scroll DOWN
          Top disappears
          Bottom stays
        */

        setShowTopNav(false);
        setShowBottomNav(true);
      } else {
        /*
          Scroll UP
          Top appears
          Bottom disappears
        */

        setShowTopNav(true);
        setShowBottomNav(false);
      }

      lastScrollY.current =
        currentScrollY;
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ======================================================
     NAV CLICK
  ====================================================== */

  const handleNavClick = (
    id: string,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (onNavChange) {
      onNavChange(id);
    }

    /* RANDOM */

    if (id === "Random") {
      if (onRandomClick) {
        onRandomClick();
      }
    }

    /* MORE */

    if (id === "More") {
      setIsMobileMoreOpen(
        (previous) => !previous
      );
    } else {
      setIsMobileMoreOpen(false);
    }

    /*
      Immediately move bubble to clicked button.
      This makes animation feel instant.
    */

    if (
      event?.currentTarget &&
      mobileNavContainerRef.current
    ) {
      const button =
        event.currentTarget;

      const container =
        mobileNavContainerRef.current;

      const containerRect =
        container.getBoundingClientRect();

      const buttonRect =
        button.getBoundingClientRect();

      const bubbleSize = 58;

      const buttonCenter =
        buttonRect.left +
        buttonRect.width / 2;

      const left =
        buttonCenter -
        containerRect.left -
        bubbleSize / 2;

      const top =
        buttonRect.top -
        containerRect.top +
        buttonRect.height / 2 -
        bubbleSize / 2 -
        3;

      /*
        Calculate travel distance.
      */

      const distance = Math.abs(
        left - mobileIndicator.left
      );

      /*
        More distance = more stretch.
      */

      const stretch =
        Math.min(
          1.32,
          1 +
            distance / 240
        );

      setMobileIndicator({
        left,
        top,
        width: bubbleSize,
        height: bubbleSize,
        opacity: 1,
        moving: distance > 8,
      });

      /*
        End liquid stretch.
      */

      window.setTimeout(() => {
        setMobileIndicator(
          (previous) => ({
            ...previous,
            moving: false,
          })
        );
      }, 500);
    }
  };

  /* ======================================================
     MOBILE ACTIVE CHECK
  ====================================================== */

  const isMobileActive = (
    id: string
  ) => {
    const current =
      getMobileActiveId();

    return current === id;
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <>
      {/* =====================================================
          DESKTOP / TOP NAVBAR
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
          transform
          ${
            showTopNav
              ? "translate-y-0 opacity-100"
              : "-translate-y-24 opacity-0 pointer-events-none"
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
          {/* SEARCH */}

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
                animate-fade-in
              "
            >
              <Search
                className="
                  w-4
                  h-4
                  text-[#23212C]/70
                  shrink-0
                "
              />

              <input
                type="text"
                autoFocus
                placeholder="Search 4K pins, cars, anime..."
                value={searchQuery}
                onChange={(event) =>
                  onSearchChange?.(
                    event.target.value
                  )
                }
                className="
                  w-full
                  bg-transparent
                  text-xs
                  font-bold
                  text-[#23212C]
                  focus:outline-none
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
                  hover:bg-slate-200
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* LOGO */}

              <Link
                href="/"
                onClick={() =>
                  onNavChange?.("Home")
                }
                className="
                  flex
                  items-center
                  gap-2
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
                    flex
                    items-center
                    justify-center
                    shadow-md
                  "
                >
                  <Sparkles
                    className="
                      w-4
                      h-4
                      text-[#F1FEC8]
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
                {/* DESKTOP ACTIVE INDICATOR */}

                <div
                  className="
                    absolute
                    bg-[#23212C]
                    pointer-events-none
                    z-0
                  "
                  style={{
                    left:
                      desktopIndicator.left,
                    top:
                      desktopIndicator.top,
                    width:
                      desktopIndicator.width,
                    height:
                      desktopIndicator.height,
                    opacity:
                      desktopIndicator.opacity,

                    borderRadius: 9999,

                    transition:
                      "all 450ms cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                />

                {desktopNavItems.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    const active =
                      activeNav ===
                      item.id;

                    if (
                      item.hasDropdown
                    ) {
                      return (
                        <div
                          key={item.id}
                          className="relative"
                        >
                          <button
                            ref={(element) => {
                              if (
                                element
                              ) {
                                desktopNavRefs.current.set(
                                  item.id,
                                  element
                                );
                              }
                            }}
                            type="button"
                            onClick={() => {
                              setIsCategoryDropdownOpen(
                                (
                                  previous
                                ) =>
                                  !previous
                              );

                              onNavChange?.(
                                item.id
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
                              ${
                                active
                                  ? "text-[#F1FEC8]"
                                  : "text-[#23212C]/80"
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
                                w-3
                                h-3
                                transition-transform
                                ${
                                  isCategoryDropdownOpen
                                    ? "rotate-180"
                                    : ""
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
                              {CATEGORIES.map(
                                (category) => (
                                  <button
                                    key={
                                      category
                                    }
                                    type="button"
                                    onClick={() => {
                                      onSelectCategory?.(
                                        category
                                      );

                                      setIsCategoryDropdownOpen(
                                        false
                                      );
                                    }}
                                    className={`
                                      text-left
                                      px-3
                                      py-2
                                      rounded-xl
                                      text-xs
                                      ${
                                        activeCategory ===
                                        category
                                          ? "bg-[#F1FEC8] text-[#23212C]"
                                          : "text-slate-300 hover:bg-slate-800"
                                      }
                                    `}
                                  >
                                    {
                                      category
                                    }
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
                        ref={(element) => {
                          if (
                            element
                          ) {
                            desktopNavRefs.current.set(
                              item.id,
                              element
                            );
                          }
                        }}
                        type="button"
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
                          ${
                            active
                              ? "text-[#F1FEC8]"
                              : "text-[#23212C]/80 hover:text-[#23212C]"
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

              {/* RIGHT SIDE */}

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
                "
              >
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
                  "
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onNavChange?.(
                      "Saved"
                    )
                  }
                  className="
                    relative
                    p-2
                    rounded-full
                    text-[#23212C]
                  "
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

      {/* =====================================================
          MOBILE BOTTOM LIQUID NAV
      ===================================================== */}

      <div
        className={`
          lg:hidden
          fixed
          bottom-3
          left-3
          right-3
          z-50
          max-w-md
          mx-auto
          transition-all
          duration-300
          ${
            showBottomNav
              ? "translate-y-0 opacity-100"
              : "translate-y-28 opacity-0 pointer-events-none"
          }
        `}
      >
        <div
          ref={mobileNavContainerRef}
          className="
            glass-navbar-dark
            relative
            rounded-full
            px-2
            py-2
            flex
            items-center
            justify-around
            overflow-visible
            min-h-[64px]
          "
        >
          {/* =================================================
              LIQUID GLASS BUBBLE
          ================================================= */}

          <div
            className={`
              liquid-pill-active
              ${
                mobileIndicator.moving
                  ? "is-moving"
                  : ""
              }
            `}
            style={{
              left:
                mobileIndicator.left,

              top:
                mobileIndicator.top,

              width:
                mobileIndicator.width,

              height:
                mobileIndicator.height,

              opacity:
                mobileIndicator.opacity,

              transform:
                mobileIndicator.moving
                  ? "scaleX(1.22) scaleY(0.84)"
                  : "scaleX(1) scaleY(1)",

              transition:
                "left 500ms cubic-bezier(0.34,1.56,0.64,1), top 500ms cubic-bezier(0.34,1.56,0.64,1), transform 500ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease",
            }}
          />

          {/* =================================================
              MOBILE BUTTONS
          ================================================= */}

          {mobileNavItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                isMobileActive(
                  item.id
                );

              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    if (element) {
                      mobileNavRefs.current.set(
                        item.id,
                        element
                      );
                    } else {
                      mobileNavRefs.current.delete(
                        item.id
                      );
                    }
                  }}
                  type="button"
                  onClick={(event) =>
                    handleNavClick(
                      item.id,
                      event
                    )
                  }
                  className={`
                    liquid-nav-button
                    ${
                      active
                        ? "active"
                        : ""
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-5
                      h-5
                      transition-all
                      duration-300
                      ${
                        active
                          ? "text-[#23212C]"
                          : "text-[#F1FEC8]/75"
                      }
                    `}
                  />

                  <span
                    className={`
                      text-[10px]
                      leading-none
                      font-extrabold
                      ${
                        active
                          ? "text-[#23212C]"
                          : "text-[#F1FEC8]/75"
                      }
                    `}
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

        {/* ===================================================
            MORE DRAWER
        =================================================== */}

        {isMobileMoreOpen && (
          <div
            className="
              absolute
              bottom-20
              left-0
              right-0
              bg-[#23212C]/95
              border
              border-slate-700/60
              rounded-3xl
              p-4
              shadow-2xl
              backdrop-blur-2xl
              text-xs
              space-y-4
              animate-fade-in
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-800
                pb-2
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

            <div
              className="
                grid
                grid-cols-2
                gap-2
              "
            >
              <button
                type="button"
                onClick={(event) =>
                  handleNavClick(
                    "Latest",
                    event
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  p-2.5
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
                onClick={(event) =>
                  handleNavClick(
                    "Categories",
                    event
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  p-2.5
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
                pt-2
                border-t
                border-slate-800/80
                flex
                flex-wrap
                items-center
                justify-between
                text-[11px]
                text-slate-400
                gap-2
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
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
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
                  setIsMobileMoreOpen(
                    false
                  )
                }
                className="
                  flex
                  items-center
                  gap-1
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