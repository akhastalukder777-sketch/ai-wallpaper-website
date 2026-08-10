'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../data/wallpapers';
import { Layers } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Category Icon Mapping for Pexels-Style Pills
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
  // Strictly Isolated Local Refs to Prevent Navbar Animation Contamination
  const categoryBtnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const trackRef = useRef<HTMLDivElement>(null);

  const [categoryIndicator, setCategoryIndicator] = useState({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
    isMoving: false,
  });

  // Calculate and update liquid indicator relative ONLY to CategoryBar track
  const updateCategoryIndicator = () => {
    const activeBtn = categoryBtnRefs.current.get(selectedCategory);
    if (activeBtn && trackRef.current) {
      setCategoryIndicator((prev) => ({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        height: activeBtn.offsetHeight,
        top: activeBtn.offsetTop,
        opacity: 1,
        isMoving:
          prev.opacity > 0 &&
          (prev.left !== activeBtn.offsetLeft || prev.width !== activeBtn.offsetWidth),
      }));
    }
  };

  // Recalculate on category selection, mount, or window resize
  useEffect(() => {
    updateCategoryIndicator();

    const timer = setTimeout(() => {
      setCategoryIndicator((prev) => ({ ...prev, isMoving: false }));
    }, 550);

    const handleResize = () => {
      updateCategoryIndicator();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [selectedCategory]);

  return (
    <div id="categories" className="w-full py-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-[#23212C]" />
        <h2 className="text-lg font-bold text-[#23212C] tracking-tight">
          Explore Categories
        </h2>
      </div>

      {/* Horizontally Scrollable Categories Track */}
      <div className="flex items-center overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 relative">
        <div ref={trackRef} className="relative flex items-center gap-2 min-w-max py-1">
          
          {/* Strictly Isolated Cosmic Glass Active Liquid Bubble */}
          <div
            className="absolute bg-[#23212C] border border-[#F1FEC8]/30 shadow-xl shadow-[#23212C]/30 pointer-events-none will-change-transform z-0"
            style={{
              transform: `translate3d(${categoryIndicator.left}px, ${categoryIndicator.top}px, 0) ${
                categoryIndicator.isMoving ? 'scaleX(1.12) scaleY(0.88)' : 'scale(1)'
              }`,
              width: `${categoryIndicator.width}px`,
              height: `${categoryIndicator.height}px`,
              opacity: categoryIndicator.opacity,
              borderRadius: categoryIndicator.isMoving
                ? '22px 12px 24px 10px'
                : '9999px',
              transition:
                'transform 550ms cubic-bezier(0.34, 1.45, 0.64, 1), width 550ms cubic-bezier(0.34, 1.45, 0.64, 1), height 550ms cubic-bezier(0.34, 1.45, 0.64, 1), border-radius 550ms ease-out, opacity 300ms ease',
            }}
          />

          {/* Pexels-Style Category Pills with Icons */}
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            const icon = CATEGORY_ICONS[category] || '✨';

            return (
              <button
                key={category}
                ref={(el) => {
                  if (el) categoryBtnRefs.current.set(category, el);
                  else categoryBtnRefs.current.delete(category);
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectCategory(category)}
                className={`relative z-10 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#F1FEC8]'
                    : 'text-[#23212C]/85 hover:text-[#23212C] hover:bg-[#23212C]/10 border border-[#23212C]/15 bg-white/40 backdrop-blur-sm'
                }`}
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