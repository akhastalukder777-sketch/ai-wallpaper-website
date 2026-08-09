'use client';

import React from 'react';
import { CATEGORIES } from '../data/wallpapers';
import { Layers } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  return (
    <div id="categories" className="w-full py-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-[#090d12]" />
        <h2 className="text-lg font-bold text-[#090d12] tracking-tight">
          Explore Categories
        </h2>
      </div>

      {/* Scrollable Categories List */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#090d12] text-[#F1FEC8] font-bold shadow-md shadow-black/20 scale-105'
                  : 'bg-slate-900/10 text-[#090d12] border border-slate-900/15 hover:bg-slate-900/20'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}