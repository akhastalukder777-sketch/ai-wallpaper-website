import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'About Us | AI Wallpapers Hub',
  description: 'Learn about AI Wallpapers Hub, our mission to provide high quality free 4K AI generated wallpapers for all devices.',
};

export default function AboutUs() {
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
            Our Mission & Story
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About AI Wallpapers Hub
          </h1>
          <p className="text-xs text-slate-400">Next-Generation 4K & Ultra HD Wallpapers</p>
        </div>

        {/* About Content */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-800">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" /> Who We Are
            </h2>
            <p>
              AI Wallpapers Hub is a modern platform dedicated to bringing high-resolution, ultra HD, and 4K wallpapers powered by cutting-edge artificial intelligence models and curated photography.
            </p>
            <p>
              Whether you are looking for pitch-black AMOLED backgrounds to save battery on your smartphone, futuristic cyberpunk aesthetics, pristine nature landscapes, or minimal art, we provide instant access without paywalls or invasive popups.
            </p>
          </section>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Zap className="w-4 h-4" /> Ultra Fast Downloads
              </div>
              <p className="text-xs text-slate-400">
                Optimized images with Next.js Turbopack image delivery for zero lag loading speeds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" /> Legal & Safe Content
              </div>
              <p className="text-xs text-slate-400">
                100% legal, royalty-free, and legally licensed AI generated visuals suitable for all ages.
              </p>
            </div>
          </div>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white">Why Choose AI Wallpapers Hub?</h2>
            <p>
              Unlike traditional wallpaper sites flooded with broken links and low-quality compression, every image on our platform is handpicked or generated at native 3840 x 2160 (4K) resolution. We offer original AI prompts for creators who wish to recreate or build upon our artwork.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}