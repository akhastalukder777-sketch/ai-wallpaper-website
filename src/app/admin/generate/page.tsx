'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../../../data/wallpapers';

export default function AdminGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('AMOLED');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/generate-ai-wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category }),
      });

      const data = await res.json();

      if (data.status === 'success' && data.wallpaper) {
        setGeneratedResult(data.wallpaper);
        setSuccess(true);
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Admin AI Wallpaper Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Generate Custom AI Wallpaper
          </h1>
          <p className="text-xs text-slate-400">Type any custom prompt to generate and instantly publish 4K AI wallpapers to your website.</p>
        </div>

        {/* Studio Card */}
        <div className="bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Custom AI Image Prompt</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Futuristic matte black supercar parked under rainy cyberpunk neon lights, 8k resolution, cinematic render"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Target Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating 4K AI Artwork...' : 'Generate & Publish to Website'}
            </button>
          </form>

          {/* Success Banner & Live Preview */}
          {success && generatedResult && (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Successfully Generated & Saved to Database!
              </div>

              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={generatedResult.imageUrl}
                  alt={generatedResult.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-semibold text-white">{generatedResult.title}</div>
                <div className="text-slate-400 font-mono text-[11px]">Prompt: "{generatedResult.prompt}"</div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                View on Homepage
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}