'use client';

import React from 'react';
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
  return (
    <div id="categories" className="w-full py-6">
      {/* CATEGORY TITLE */}

      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-[#0B1F4D]" />

        <h2 className="text-lg font-bold text-[#0B1F4D] tracking-tight">
          Explore Categories
        </h2>
      </div>

      {/* HORIZONTAL CATEGORY PILLS */}

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
          className="
            flex
            items-center
            gap-2
            min-w-max
            py-1
          "
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            const icon = CATEGORY_ICONS[category] || '✨';

            return (
              <button
                key={category}
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
                  ${
                    isActive
                      ? 'glass-category-pill-active premium-category-active'
                      : 'glass-category-pill'
                  }
                `}
              >
                <span className="text-sm leading-none">
                  {icon}
                </span>

                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}