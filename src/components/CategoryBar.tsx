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
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    height: number;
    top: number;
    opacity: number;
    isMoving: boolean;
  }>({
    left: 0,
    width: 0,
    height: 0,
    top: 0,
    opacity: 0,
    isMoving: false,
  });

  // Calculate and update liquid indicator dimensions & offset
  const updateIndicator = () => {
    const activeBtn = buttonRefs.current.get(selectedCategory);
    if (activeBtn) {
      setIndicatorStyle((prev) => ({
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

  // Recalculate position on category change, initial mount, and screen resize
  useEffect(() => {
    updateIndicator();

    const timer = setTimeout(() => {
      setIndicatorStyle((prev) => ({ ...prev, isMoving: false }));
    }, 550);

    const handleResize = () => {
      updateIndicator();
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
        <Layers className="w-5 h-5 text-[#090d12]" />
        <h2 className="text-lg font-bold text-[#090d12] tracking-tight">
          Explore Categories
        </h2>
      </div>

      {/* Scrollable Pexels-Style Category Track */}
      <div
        ref={containerRef}
        className="flex items-center overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 relative"
      >
        <div className="relative flex items-center gap-2 min-w-max py-1">
          {/* Animated Liquid/Morphing Active Bubble Indicator */}
          <div
            className="absolute bg-[#090d12] border border-[#090d12]/20 shadow-xl shadow-black/25 pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0) ${
                indicatorStyle.isMoving ? 'scaleX(1.12) scaleY(0.90)' : 'scale(1)'
              }`,
              width: `${indicatorStyle.width}px`,
              height: `${indicatorStyle.height}px`,
              opacity: indicatorStyle.opacity,
              borderRadius: indicatorStyle.isMoving
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
                  if (el) buttonRefs.current.set(category, el);
                  else buttonRefs.current.delete(category);
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectCategory(category)}
                className={`relative z-10 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#F1FEC8]'
                    : 'text-[#090d12]/85 hover:text-[#090d12] hover:bg-slate-900/10 border border-slate-900/15 bg-white/40 backdrop-blur-sm'
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