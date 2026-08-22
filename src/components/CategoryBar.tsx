'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '../data/wallpapers';
import { Layers } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Category Icon Mapping
const CATEGORY_ICONS: Record<string, string> = {
  All: '✨',
  Anime: '⛩️',
  AMOLED: '📱',
  Dark: '🌙',
  Nature: '🌿',
  Cars: '🚗',
  Bikes: '🏍️',
  Space: '🌌',
  Gaming: '🎮',
  Minimal: '✨',
  Technology: '💻',
  Animals: '🦁',
  Flowers: '🌸',
  Mountains: '⛰️',
  Cities: '🏙️',
  Abstract: '🎨',
  Aesthetic: '✨',
  Fantasy: '🔮',
  Cyberpunk: '🌆',
  Architecture: '🏛️',
  Ocean: '🌊',
  Sunset: '🌅',
  Mixed: '🔀',
};

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
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
    const timer = setTimeout(updateBubble, 50);

    window.addEventListener('resize', updateBubble);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateBubble);
    };
  }, [selectedCategory]);

  return (
    <div id="categories" className="w-full py-6">
      {/* CATEGORY TITLE */}

      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-[#0B1F4D]" />

        <h2 className="text-lg font-bold text-[#0B1F4D] tracking-tight">
          Explore Categories
        </h2>
      </div>

      {/* HORIZONTAL CATEGORY PILLS WITH ONE MOVING BUBBLE */}

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
            gap-2
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
            const icon = CATEGORY_ICONS[category] || '✨';

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
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  font-bold
                  flex
                  items-center
                  gap-1.5
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
                <span className="text-sm leading-none">{icon}</span>
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}