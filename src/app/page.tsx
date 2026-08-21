'use client';

import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';

import Link from 'next/link';

import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import WallpaperCard from '../components/WallpaperCard';
import WallpaperModal from '../components/WallpaperModal';

import {
  HeaderAd,
  InFeedAd,
  FooterAd,
} from '../components/AdComponents';

import {
  INITIAL_WALLPAPERS,
  Wallpaper,
} from '../data/wallpapers';

import {
  getStoredFavorites,
  saveStoredFavorites,
  getWallpapersFromDb,
} from '../lib/db';

import {
  Sparkles,
  Flame,
  Search,
  ShieldCheck,
  FileText,
  Info,
  Compass,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';


export default function Home() {

  /* ============================================================
     SEARCH
     ============================================================ */

  const [searchQuery, setSearchQuery] =
    useState('');


  /* ============================================================
     CATEGORY
     ============================================================ */

  const [selectedCategory, setSelectedCategory] =
    useState('All');


  /* ============================================================
     SELECTED WALLPAPER
     ============================================================ */

  const [selectedWallpaper, setSelectedWallpaper] =
    useState<Wallpaper | null>(null);


  /* ============================================================
     FAVORITES
     ============================================================ */

  const [favoriteIds, setFavoriteIds] =
    useState<string[]>([]);


  /* ============================================================
     WALLPAPERS
     ============================================================ */

  const [wallpapers, setWallpapers] =
    useState<Wallpaper[]>(
      INITIAL_WALLPAPERS
    );


  /* ============================================================
     LOAD MORE COUNT
     ============================================================ */

  const [visibleCount, setVisibleCount] =
    useState(30);


  /* ============================================================
     ACTIVE NAV
     ============================================================ */

  const [activeNav, setActiveNav] =
    useState('Home');


  /* ============================================================
     LOAD DATABASE + FAVORITES
     ============================================================ */

  useEffect(() => {

    const loadInitialData = async () => {

      try {

        const dbWallpapers =
          await getWallpapersFromDb();


        if (
          dbWallpapers &&
          dbWallpapers.length > 0
        ) {

          setWallpapers(
            dbWallpapers
          );

        } else {

          setWallpapers(
            INITIAL_WALLPAPERS
          );
        }

      } catch (error) {

        console.error(
          'Failed to load wallpapers:',
          error
        );

        setWallpapers(
          INITIAL_WALLPAPERS
        );
      }


      /* LOAD FAVORITES */

      const savedFavs =
        getStoredFavorites();

      if (
        savedFavs &&
        savedFavs.length > 0
      ) {

        setFavoriteIds(
          savedFavs
        );
      }

    };


    loadInitialData();

  }, []);


  /* ============================================================
     RESET LOAD MORE WHEN FILTER CHANGES
     ============================================================ */

  useEffect(() => {

    setVisibleCount(30);

  }, [
    searchQuery,
    selectedCategory,
    activeNav,
  ]);


  /* ============================================================
     FAVORITE TOGGLE
     ============================================================ */

  const handleFavoriteToggle = (
    id: string
  ) => {

    setFavoriteIds((prev) => {

      const updated =
        prev.includes(id)

          ? prev.filter(
              (item) =>
                item !== id
            )

          : [
              ...prev,
              id,
            ];


      saveStoredFavorites(
        updated
      );


      return updated;
    });
  };


  /* ============================================================
     RANDOM WALLPAPER
     ============================================================ */

  const handleRandomWallpaper = () => {

    if (
      wallpapers.length === 0
    ) {
      return;
    }


    const randomIndex =
      Math.floor(
        Math.random() *
        wallpapers.length
      );


    setSelectedWallpaper(
      wallpapers[randomIndex]
    );
  };


  /* ============================================================
     FILTER WALLPAPERS
     ============================================================ */

  const filteredWallpapers =
    useMemo(() => {

      return wallpapers.filter(
        (wallpaper) => {

          /* SAVED */

          if (
            activeNav === 'Saved'
          ) {

            if (
              !favoriteIds.includes(
                wallpaper.id
              )
            ) {
              return false;
            }
          }


          /* TRENDING */

          if (
            activeNav === 'Trending' &&
            !wallpaper.isTrending
          ) {

            return false;
          }


          /* CATEGORY */

          if (
            selectedCategory !== 'All' &&
            wallpaper.category !==
              selectedCategory
          ) {

            return false;
          }


          /* SEARCH */

          if (
            searchQuery.trim() !== ''
          ) {

            const query =
              searchQuery
                .toLowerCase()
                .trim();


            const matchesTitle =
              wallpaper.title
                ? wallpaper.title
                    .toLowerCase()
                    .includes(query)
                : false;


            const matchesDescription =
              wallpaper.description
                ? wallpaper.description
                    .toLowerCase()
                    .includes(query)
                : false;


            const matchesCategory =
              wallpaper.category
                ? wallpaper.category
                    .toLowerCase()
                    .includes(query)
                : false;


            const matchesTags =
              wallpaper.tags
                ? wallpaper.tags.some(
                    (tag) =>
                      tag
                        .toLowerCase()
                        .includes(query)
                  )
                : false;


            return (
              matchesTitle ||
              matchesDescription ||
              matchesCategory ||
              matchesTags
            );
          }


          return true;
        }
      );

    }, [
      wallpapers,
      searchQuery,
      selectedCategory,
      activeNav,
      favoriteIds,
    ]);


  /* ============================================================
     DISPLAYED WALLPAPERS
     ============================================================ */

  const displayedWallpapers =
    useMemo(() => {

      return filteredWallpapers.slice(
        0,
        visibleCount
      );

    }, [
      filteredWallpapers,
      visibleCount,
    ]);


  /* ============================================================
     PAGE
     ============================================================ */

  return (

    <div
      className="
        min-h-screen
        bg-transparent
        text-[#0B1F4D]
        flex
        flex-col
        selection:bg-[#2D8CFF]
        selection:text-white
      "
    >

      {/* ========================================================
          NAVBAR
          ======================================================== */}

      <Navbar

        searchQuery={
          searchQuery
        }

        onSearchChange={
          setSearchQuery
        }

        favoriteCount={
          favoriteIds.length
        }

        activeCategory={
          selectedCategory
        }

        onSelectCategory={
          setSelectedCategory
        }

        activeNav={
          activeNav
        }

        onNavChange={
          setActiveNav
        }

        onRandomClick={
          handleRandomWallpaper
        }

      />


      {/* ========================================================
          HEADER AD
          ======================================================== */}

      <div className="pt-4">

        <HeaderAd />

      </div>


     {/* ========================================================
    PREMIUM HERO
    ======================================================== */}

<section
  className="
    relative
    max-w-[1600px]
    mx-auto
    w-full
    px-3
    sm:px-6
    lg:px-8
    pt-5
    pb-7
  "
>
  <div className="premium-hero">
    
    {/* Background glow */}
    <div className="premium-hero-glow premium-hero-glow-one" />
    <div className="premium-hero-glow premium-hero-glow-two" />

    {/* ====================================================
        LEFT CONTENT
        ==================================================== */}

    <div className="premium-hero-content">

      {/* Badge */}
      <div
        className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-white/65
          border
          border-white/90
          backdrop-blur-xl
          shadow-sm
          text-[#0B1F4D]
          text-xs
          font-bold
          w-fit
        "
      >
        <Sparkles
          className="w-4 h-4 text-[#2D8CFF]"
          style={{
            animation: "premiumSparkle 4s ease-in-out infinite",
          }}
        />

        <span>
          Discover & Save Ultra HD 4K Pins
        </span>
      </div>


      {/* Title */}
      <h1
        className="
          mt-6
          text-4xl
          sm:text-5xl
          lg:text-[58px]
          xl:text-[64px]
          font-black
          tracking-tight
          text-[#0B1F4D]
          leading-[1.02]
          max-w-[650px]
        "
      >
        Explore Millions of

        <br />

        <span
          className="
            bg-gradient-to-r
            from-[#0B1F4D]
            via-[#178DFF]
            to-[#00BFA6]
            bg-clip-text
            text-transparent
          "
        >
          4K Ultra HD Wallpapers
        </span>
      </h1>


      {/* Description */}
      <p
        className="
          mt-5
          text-sm
          sm:text-base
          lg:text-[17px]
          text-[#46617D]
          font-medium
          max-w-[560px]
          leading-relaxed
        "
      >
        Free high-resolution vertical pins & 4K wallpapers for
        Mobile, AMOLED, Desktop & Laptop. Updated daily.
      </p>


      {/* Features */}
      <div
        className="
          mt-7
          flex
          flex-wrap
          items-center
          gap-2
          sm:gap-3
        "
      >

        {/* Ultra HD */}
        <div className="premium-hero-feature">
          <div className="premium-feature-icon">
            4K
          </div>

          <div>
            <div className="premium-feature-title">
              Ultra HD
            </div>

            <div className="premium-feature-subtitle">
              High Quality
            </div>
          </div>
        </div>


        {/* Download */}
        <div className="premium-hero-feature">
          <div className="premium-feature-icon">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="premium-feature-title">
              Free
            </div>

            <div className="premium-feature-subtitle">
              Download
            </div>
          </div>
        </div>


        {/* Curated */}
        <div className="premium-hero-feature">
          <div className="premium-feature-icon">
            <Flame className="w-5 h-5" />
          </div>

          <div>
            <div className="premium-feature-title">
              Curated
            </div>

            <div className="premium-feature-subtitle">
              Best Picks
            </div>
          </div>
        </div>


        {/* Updated */}
        <div className="premium-hero-feature">
          <div className="premium-feature-icon">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <div className="premium-feature-title">
              Updated
            </div>

            <div className="premium-feature-subtitle">
              Daily
            </div>
          </div>
        </div>

      </div>


      {/* MOBILE SEARCH */}
      <div
        className="
          md:hidden
          pt-5
          max-w-md
        "
      >
        <div className="relative">

          <Search
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-slate-500
            "
          />

          <input
            type="text"
            placeholder="Search pins, cars, anime, nature..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="
              w-full
              pl-11
              pr-4
              py-3
              bg-white/90
              border
              border-white
              rounded-2xl
              text-sm
              text-[#0B1F4D]
              placeholder-slate-500
              focus:outline-none
              focus:border-[#2D8CFF]
              shadow-sm
            "
          />

        </div>
      </div>

    </div>


    {/* ====================================================
        RIGHT WORKSPACE VISUAL
        ==================================================== */}

    <div className="premium-workspace">

      {/* Soft background */}
      <div className="workspace-light" />

      {/* Decorative plant */}
      <div className="workspace-plant">
        <span className="plant-stem" />
        <span className="plant-leaf leaf-1" />
        <span className="plant-leaf leaf-2" />
        <span className="plant-leaf leaf-3" />
        <span className="plant-leaf leaf-4" />
        <span className="plant-leaf leaf-5" />
      </div>


      {/* ==================================================
          MAIN WALL FRAME
          ================================================== */}

      <div className="workspace-wall-frame">

        <div className="wall-frame-top">
          {wallpapers[0] && (
            <img
              src={wallpapers[0].imageUrl}
              alt={wallpapers[0].title || "Wallpaper"}
              className="workspace-wallpaper"
            />
          )}
        </div>

        <div className="wall-frame-bottom">
          {wallpapers[1] && (
            <img
              src={wallpapers[1].imageUrl}
              alt={wallpapers[1].title || "Wallpaper"}
              className="workspace-wallpaper"
            />
          )}
        </div>

      </div>


      {/* Second wall frame */}
      <div className="workspace-small-frame workspace-frame-two">
        {wallpapers[2] && (
          <img
            src={wallpapers[2].imageUrl}
            alt={wallpapers[2].title || "Wallpaper"}
            className="workspace-wallpaper"
          />
        )}
      </div>


      {/* Third wall frame */}
      <div className="workspace-small-frame workspace-frame-three">
        {wallpapers[3] && (
          <img
            src={wallpapers[3].imageUrl}
            alt={wallpapers[3].title || "Wallpaper"}
            className="workspace-wallpaper"
          />
        )}
      </div>


      {/* ==================================================
          DESK
          ================================================== */}

      <div className="workspace-desk">

        {/* Monitor */}
        <div className="workspace-monitor">

          <div className="monitor-screen">
            {wallpapers[4] && (
              <img
                src={wallpapers[4].imageUrl}
                alt={wallpapers[4].title || "Wallpaper"}
                className="workspace-wallpaper"
              />
            )}

            <div className="monitor-glass" />
          </div>

          <div className="monitor-neck" />
          <div className="monitor-base" />

        </div>


        {/* Keyboard */}
        <div className="workspace-keyboard">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>


        {/* Mouse */}
        <div className="workspace-mouse" />


        {/* Headphones */}
        <div className="workspace-headphones">
          <div className="headphone-band" />
          <div className="headphone-left" />
          <div className="headphone-right" />
        </div>


        {/* Small plant */}
        <div className="workspace-mini-plant">
          <div className="mini-pot" />
          <span />
          <span />
          <span />
        </div>

      </div>


      {/* Desk front */}
      <div className="workspace-desk-front" />

    </div>

  </div>
</section>


      {/* ========================================================
          MAIN
          ======================================================== */}

      <main
        className="
          flex-1
          max-w-[1600px]
          mx-auto
          w-full
          px-3
          sm:px-6
          lg:px-8
          pb-16
        "
      >

        {/* CATEGORY BAR */}

        <CategoryBar
          selectedCategory={
            selectedCategory
          }
          onSelectCategory={
            setSelectedCategory
          }
        />


        {/* ======================================================
            SECTION HEADER
            ====================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            my-4
            border-b
            border-white/80
            pb-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Flame
              className="
                w-5
                h-5
                text-[#0B1F4D]
              "
            />

            <h2
              className="
                text-lg
                font-bold
                text-[#0B1F4D]
                tracking-tight
              "
            >

              {activeNav === 'Saved'

                ? 'Saved Favorite Pins'

                : activeNav === 'Trending'

                ? 'Trending Pins'

                : selectedCategory === 'All'

                ? 'Discover Pins'

                : `${selectedCategory} Pins`}

            </h2>


            <span
              className="
                text-xs
                px-2.5
                py-0.5
                rounded-full
                bg-slate-900/10
                text-[#0B1F4D]
                font-semibold
                border
                border-white/90
                ml-1
              "
            >
              Showing {displayedWallpapers.length} of {filteredWallpapers.length}
            </span>

          </div>

        </div>


        {/* ======================================================
            WALLPAPER GRID
            ====================================================== */}

        {displayedWallpapers.length > 0 ? (

          <div className="space-y-8">

            <div
              className="
                columns-2
                sm:columns-3
                md:columns-4
                lg:columns-5
                gap-3
                sm:gap-4
                space-y-4
              "
            >

              {displayedWallpapers.map(
                (
                  wallpaper,
                  index
                ) => (

                  <React.Fragment
                    key={
                      wallpaper.id
                    }
                  >

                    <WallpaperCard
                      wallpaper={
                        wallpaper
                      }
                      onSelect={
                        setSelectedWallpaper
                      }
                      onFavoriteToggle={
                        handleFavoriteToggle
                      }
                      isFavorite={
                        favoriteIds.includes(
                          wallpaper.id
                        )
                      }
                    />


                    {/* IN-FEED AD */}

                    {(index + 1) % 6 === 0 && (

                      <div
                        className="
                          break-inside-avoid
                          mb-4
                        "
                      >

                        <InFeedAd />

                      </div>

                    )}

                  </React.Fragment>

                )
              )}

            </div>


            {/* ==================================================
                LOAD MORE
                ONLY:
                Load More + Arrow
                NO REMAINING COUNT
                ================================================== */}

            {visibleCount <
              filteredWallpapers.length && (

              <div
                className="
                  text-center
                  pt-8
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      (prev) =>
                        prev + 30
                    )
                  }
                  className="
                    group
                    load-more-stretch
                  "
                >

                  <span
                    className="
                      load-more-text
                    "
                  >
                    Load More
                  </span>


                  <span
                    className="
                      load-more-arrow
                    "
                  >

                    <ChevronDown
                      className="
                        w-5
                        h-5
                        text-[#F1FEC8]
                      "
                    />

                  </span>

                </button>

              </div>
            )}

          </div>

        ) : (

          /* ====================================================
             NO RESULTS
             ==================================================== */

          <div
            className="
              py-20
              text-center
              space-y-4
              rounded-3xl
              bg-white/60
              border
              border-white/80
              backdrop-blur-xl
            "
          >

            <Compass
              className="
                w-12
                h-12
                text-slate-500
                mx-auto
              "
            />


            <h3
              className="
                text-lg
                font-semibold
                text-[#0B1F4D]
              "
            >
              No pins found
            </h3>


            <p
              className="
                text-xs
                text-slate-600
                max-w-md
                mx-auto
              "
            >
              We couldn't find any pins matching your query. Try searching for something else or reset filters.
            </p>


            <button
              type="button"
              onClick={() => {

                setSearchQuery('');

                setSelectedCategory(
                  'All'
                );

                setActiveNav(
                  'Home'
                );

              }}
              className="
                px-5
                py-2.5
                rounded-full
                bg-gradient-to-r from-[#2D8CFF] to-[#00BFA6]
                hover:from-[#178DFF] hover:to-[#00A98F]
                text-white
                text-xs
                font-bold
                transition-colors
              "
            >
              Reset Filters
            </button>

          </div>

        )}


        {/* ======================================================
            FOOTER AD
            ====================================================== */}

        <div className="pt-8">

          <FooterAd />

        </div>

      </main>


      {/* ========================================================
          WALLPAPER MODAL
          ======================================================== */}

      <WallpaperModal

        wallpaper={
          selectedWallpaper
        }

        onClose={() =>
          setSelectedWallpaper(null)
        }

        onFavoriteToggle={
          handleFavoriteToggle
        }

        isFavorite={
          selectedWallpaper
            ? favoriteIds.includes(
                selectedWallpaper.id
              )
            : false
        }

      />


      {/* ========================================================
          FOOTER
          ======================================================== */}

      <footer
        className="
          mt-auto
          bg-white/55
          backdrop-blur-xl
          border-t
          border-white/80
          py-12
          text-[#46617D]
          text-xs
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            space-y-8
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-6
            "
          >

            <div
              className="
                space-y-2
                text-center
                md:text-left
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-center
                  md:justify-start
                  gap-2
                  text-[#0B1F4D]
                  font-bold
                  text-lg
                "
              >

                <Sparkles
                  className="
                    w-5
                    h-5
                    text-[#2D8CFF]
                  "
                />

                Wallpapers Hub

              </div>


              <p
                className="
                  text-[#5F7893]
                  max-w-md
                "
              >
                Your primary source for high quality 4K and Ultra HD wallpapers for Desktop, Laptop, and Smartphones.
              </p>

            </div>


            {/* FOOTER LINKS */}

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-6
                text-[#46617D]
                font-medium
              "
            >

              <Link
                href="/privacy-policy"
                className="
                  hover:text-[#178DFF]
                  transition-colors
                  flex
                  items-center
                  gap-1
                "
              >

                <ShieldCheck className="w-3 h-3" />

                Privacy Policy

              </Link>


              <Link
                href="/terms-of-service"
                className="
                  hover:text-[#178DFF]
                  transition-colors
                  flex
                  items-center
                  gap-1
                "
              >

                <FileText className="w-3 h-3" />

                Terms of Service

              </Link>


              <Link
                href="/about"
                className="
                  hover:text-[#178DFF]
                  transition-colors
                  flex
                  items-center
                  gap-1
                "
              >

                <Info className="w-3 h-3" />

                About Us

              </Link>


              <Link
                href="/contact"
                className="
                  hover:text-[#178DFF]
                  transition-colors
                  flex
                  items-center
                  gap-1
                "
              >

                <Info className="w-3 h-3" />

                Contact Us

              </Link>


              <Link
                href="/disclaimer"
                className="
                  hover:text-[#178DFF]
                  transition-colors
                  flex
                  items-center
                  gap-1
                "
              >

                <AlertCircle className="w-3 h-3" />

                Disclaimer

              </Link>

            </div>

          </div>


          {/* COPYRIGHT */}

          <div
            className="
              pt-6
              border-t
              border-slate-900
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              text-slate-600
              gap-4
              text-[11px]
            "
          >

            <div>
              © {new Date().getFullYear()} Wallpapers Hub. All rights reserved.
            </div>

            <div>
              Built for High Speed.
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}