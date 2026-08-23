'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, Wallpaper } from '../data/wallpapers';
import { Layers } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  wallpapers?: Wallpaper[];
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
  wallpapers = [],
}: CategoryBarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [bubbleStyle, setBubbleStyle] = useState({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  /* ============================================================
     DYNAMIC FIRST WALLPAPER THUMBNAIL MAPPING
  ============================================================ */

  const categoryThumbnails = useMemo(() => {
    const thumbMap: Record<string, string> = {};

    // 'All' category uses the first wallpaper from the list
    if (wallpapers.length > 0) {
      thumbMap['All'] =
        wallpapers[0].thumbnailUrl || wallpapers[0].imageUrl || '';
    }

    // For each specific category, find the first matching wallpaper
    CATEGORIES.forEach((cat) => {
      if (cat === 'All') return;
      const match = wallpapers.find(
        (w) => w.category?.trim().toLowerCase() === cat.trim().toLowerCase()
      );
      if (match) {
        thumbMap[cat] = match.thumbnailUrl || match.imageUrl || '';
      }
    });

    return thumbMap;
  }, [wallpapers]);

  /* ============================================================
     ONE MOVING BUBBLE POSITION CALCULATION
  ============================================================ */

  useEffect(() => {
    const updateBubble = () => {
      const activeButton = buttonRefs.current[selectedCategory];
      const container = containerRef.current;

      if (activeButton && container) {
        setBubbleStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
          height: activeButton.offsetHeight,
          opacity: 1,
        });
      }
    };

    updateBubble();
    const timer = setTimeout(updateBubble, 60);

    window.addEventListener('resize', updateBubble);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateBubble);
    };
  }, [selectedCategory, wallpapers]);

  return (
    <div id="categories" className="w-full py-6">
      {/* CATEGORY TITLE */}

      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-[#0B1F4D]" />

        <h2 className="text-lg font-bold text-[#0B1F4D] tracking-tight">
          Explore Categories
        </h2>
      </div>

      {/* HORIZONTAL CATEGORY PILLS WITH CIRCULAR THUMBNAILS & MOVING BUBBLE */}

      <div
        className="
          flex
          items-center
          overflow-x-auto
          pb-3
          pt-1
          scrollbar-none
          no-scrollbar
          -mx-4
          px-4
          sm:mx-0
          sm:px-0
          relative
        "
      >
        <div
          ref={containerRef}
          className="
            flex
            items-center
            gap-2.5
            min-w-max
            py-1
            relative
          "
        >
          {/* SINGLE MOVING ACTIVE PILL BUBBLE */}
          <div
            className="category-active-bubble absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
            style={{
              left: `${bubbleStyle.left}px`,
              width: `${bubbleStyle.width}px`,
              height: `${bubbleStyle.height}px`,
              opacity: bubbleStyle.opacity,
            }}
          />

          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            const thumbUrl = categoryThumbnails[category];

            return (
              <button
                key={category}
                ref={(el) => {
                  buttonRefs.current[category] = el;
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectCategory(category)}
                className={`
                  relative
                  z-10
                  whitespace-nowrap
                  pl-1.5
                  pr-4
                  py-1.5
                  rounded-full
                  text-xs
                  font-bold
                  flex
                  items-center
                  gap-2
                  cursor-pointer
                  transition-colors
                  duration-200
                  ${
                    isActive
                      ? 'text-white font-extrabold'
                      : 'glass-category-pill text-[#0B1F4D]'
                  }
                `}
              >
                {/* CIRCULAR THUMBNAIL OF FIRST WALLPAPER */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-white/90 shadow-sm bg-slate-200 flex items-center justify-center">
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={category}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[11px] font-black text-slate-600 uppercase">
                      {category.slice(0, 1)}
                    </span>
                  )}
                </div>

                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}