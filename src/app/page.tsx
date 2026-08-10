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
        bg-[#F1FEC8]
        text-[#090d12]
        flex
        flex-col
        selection:bg-[#090d12]
        selection:text-[#F1FEC8]
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
          HERO
          ======================================================== */}

      <section
        className="
          relative
          py-8
          sm:py-12
          px-4
          sm:px-6
          lg:px-8
          max-w-7xl
          mx-auto
          w-full
          text-center
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[500px]
            h-[250px]
            bg-white/40
            blur-[120px]
            rounded-full
            pointer-events-none
          "
        />


        <div
          className="
            relative
            z-10
            max-w-3xl
            mx-auto
            space-y-4
          "
        >

          {/* BADGE */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-1.5
              rounded-full
              bg-slate-900/10
              border
              border-slate-900/20
              text-[#090d12]
              text-xs
              font-bold
              backdrop-blur-md
              shadow-sm
            "
          >

            <Sparkles
              className="
                w-4
                h-4
                text-[#090d12]
                animate-spin
              "
              style={{
                animationDuration:
                  '6s',
              }}
            />

            <span>
              Discover & Save Ultra HD 4K Pins
            </span>

          </div>


          {/* TITLE */}

          <h1
            className="
              text-3xl
              sm:text-5xl
              font-black
              tracking-tight
              text-[#090d12]
              leading-tight
            "
          >

            Explore Millions of

            <br className="hidden sm:inline" />

            <span
              className="
                bg-gradient-to-r
                from-[#090d12]
                via-slate-800
                to-indigo-950
                bg-clip-text
                text-transparent
              "
            >
              4K Ultra HD Wallpapers
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p
            className="
              text-sm
              sm:text-base
              text-slate-700
              font-medium
              max-w-xl
              mx-auto
              leading-relaxed
            "
          >
            Free high-resolution vertical pins & 4K wallpapers for Mobile, AMOLED, Desktop & Laptop. Updated daily.
          </p>


          {/* MOBILE SEARCH */}

          <div
            className="
              md:hidden
              pt-2
              max-w-md
              mx-auto
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
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  bg-white/90
                  border
                  border-slate-900/20
                  rounded-2xl
                  text-sm
                  text-[#090d12]
                  placeholder-slate-500
                  focus:outline-none
                  focus:border-[#090d12]
                "
              />

            </div>

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
            border-slate-900/15
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
                text-[#090d12]
              "
            />

            <h2
              className="
                text-lg
                font-bold
                text-[#090d12]
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
                text-[#090d12]
                font-semibold
                border
                border-slate-900/20
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
              bg-white/50
              border
              border-slate-900/10
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
                text-[#090d12]
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
                bg-[#090d12]
                hover:bg-slate-800
                text-[#F1FEC8]
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
          bg-[#090d12]
          border-t
          border-slate-800/80
          py-12
          text-slate-400
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
                  text-white
                  font-bold
                  text-lg
                "
              >

                <Sparkles
                  className="
                    w-5
                    h-5
                    text-[#F1FEC8]
                  "
                />

                Wallpapers Hub

              </div>


              <p
                className="
                  text-slate-500
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
                text-slate-400
                font-medium
              "
            >

              <Link
                href="/privacy-policy"
                className="
                  hover:text-[#F1FEC8]
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
                  hover:text-[#F1FEC8]
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
                  hover:text-[#F1FEC8]
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
                  hover:text-[#F1FEC8]
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
                  hover:text-[#F1FEC8]
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
              Built for High Speed, SEO & Google AdSense Approval.
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}