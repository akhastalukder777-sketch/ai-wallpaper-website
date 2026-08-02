'use client';

import React from 'react';
import { CATEGORIES } from '../data/wallpapers';
import { Sparkles, Layers } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  showAiOnly: boolean;
  onToggleAiOnly: () => void;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
  showAiOnly,
  onToggleAiOnly,
}: CategoryBarProps) {
  return (
    <div id="categories" className="w-full py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            Explore Categories
          </h2>
        </div>

        {/* AI Only Filter Toggle */}
        <button
          onClick={onToggleAiOnly}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showAiOnly
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/50 shadow-md shadow-indigo-500/20'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${showAiOnly ? 'text-white' : 'text-indigo-400'}`} />
          AI Generated Only
        </button>
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