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
        <Layers className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
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