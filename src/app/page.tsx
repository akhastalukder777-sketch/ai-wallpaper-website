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
  Download,
  Heart,
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
          >>> NEW HERO SECTION (WITH REAL WORKSPACE PHOTO) <<<
          ======================================================== */}

      <section
        className="
          relative
          px-4
          sm:px-6
          lg:px-8
          pt-4
          pb-6
          max-w-[1440px]
          mx-auto
          w-full
        "
      >
        <div className="premium-hero-card">

          {/* RIGHT SIDE ORIGINAL WORKSPACE SETUP IMAGE */}
          <div className="premium-hero-workspace-wrapper">
            <img
              src="/hero-setup.webp"
              alt="Anime Desk Setup Workspace"
              className="premium-hero-workspace-img"
              onError={(e) => {
                // png বা jpg থাকলে স্বয়ংক্রিয়ভাবে ফলব্যাক হবে
                const target = e.currentTarget;
                if (!target.src.endsWith('.png')) {
                  target.src = '/hero-setup.png';
                }
              }}
            />
            {/* SMOOTH FEATHER GRADIENT OVERLAY */}
            <div className="premium-hero-workspace-overlay" />
          </div>

          {/* LEFT HERO CONTENT */}
          <div className="premium-hero-content">

            {/* TOP PILL BADGE */}
            <div className="premium-hero-badge">
              <Sparkles className="w-3.5 h-3.5 text-[#178DFF]" />
              <span>Discover &amp; Save Ultra HD 4K Pins</span>
            </div>

            {/* MAIN TITLE (PRESERVING EXACT TEXT & EXISTING GRADIENT) */}
            <h1 className="premium-hero-title">
              Explore Millions of
              <br />
              <span className="hero-gradient-text">
                4K Ultra HD Wallpapers
              </span>
            </h1>

            {/* SUBTITLE */}
            <p className="premium-hero-description">
              Free high-resolution vertical pins &amp; 4K wallpapers for Mobile,
              AMOLED, Desktop &amp; Laptop. Updated daily.
            </p>

            {/* 4 FEATURE PILLS */}
            <div className="premium-hero-features">

              {/* 1. 4K Ultra HD */}
              <div className="premium-feature-pill">
                <div className="premium-feature-tag">4K</div>
                <div className="premium-feature-text">
                  <strong>Ultra HD</strong>
                  <small>High Quality</small>
                </div>
              </div>

              {/* 2. Free Download */}
              <div className="premium-feature-pill">
                <div className="premium-feature-icon">
                  <Download className="w-3.5 h-3.5 text-[#178DFF]" />
                </div>
                <div className="premium-feature-text">
                  <strong>Free</strong>
                  <small>Download</small>
                </div>
              </div>

              {/* 3. Curated Best Picks */}
              <div className="premium-feature-pill">
                <div className="premium-feature-icon">
                  <Heart className="w-3.5 h-3.5 text-[#2D8CFF]" />
                </div>
                <div className="premium-feature-text">
                  <strong>Curated</strong>
                  <small>Best Picks</small>
                </div>
              </div>

              {/* 4. Updated Daily */}
              <div className="premium-feature-pill">
                <div className="premium-feature-icon">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00BFA6]" />
                </div>
                <div className="premium-feature-text">
                  <strong>Updated</strong>
                  <small>Daily</small>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          >>> END OF HERO SECTION <<<
          ======================================================== */}


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