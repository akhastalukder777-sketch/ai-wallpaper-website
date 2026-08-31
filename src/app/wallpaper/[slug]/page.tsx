// src/app/wallpaper/[slug]/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWallpaperBySlug, getRelatedWallpapers } from '../../../lib/db';
import WallpaperCard from '../../../components/WallpaperCard';
import WallpaperDetailActions from '../../../components/WallpaperDetailActions';
import { HeaderAd, FooterAd } from '../../../components/AdComponents';
import {
  ChevronRight,
  Monitor,
  Eye,
  Download,
  Calendar,
  Tag,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Info,
  AlertCircle,
} from 'lucide-react';

interface WallpaperPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({
  params,
}: WallpaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);

  if (!wallpaper) {
    return {
      title: 'Wallpaper Not Found | AI Wallpapers Hub',
      description: 'The requested 4K wallpaper could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiwallpapershub.com';
  const canonicalUrl = `${baseUrl}/wallpaper/${wallpaper.slug || wallpaper.id}`;
  const imageUrl = wallpaper.imageUrl || wallpaper.thumbnailUrl;
  const pageTitle = `${wallpaper.title} 4K Wallpaper Download`;
  const pageDescription =
    wallpaper.description ||
    `Download high resolution 3840x2160 4K ${wallpaper.category} wallpaper "${wallpaper.title}" free for Desktop, iPhone, Android and AMOLED displays.`;

  const tags = Array.isArray(wallpaper.tags) ? wallpaper.tags : [wallpaper.category];
  const keywords = [
    wallpaper.title,
    `${wallpaper.category} 4k wallpaper`,
    'Ultra HD wallpaper',
    'Free wallpaper download',
    'Desktop 4k background',
    'Phone wallpaper',
    ...tags,
  ];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonicalUrl,
      title: `${wallpaper.title} | AI Wallpapers Hub`,
      description: pageDescription,
      siteName: 'AI Wallpapers Hub',
      images: [
        {
          url: imageUrl,
          width: 1920,
          height: 1080,
          alt: `${wallpaper.title} 4K Ultra HD Wallpaper`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${wallpaper.title} | AI Wallpapers Hub`,
      description: pageDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 2. Server Component Page Render
export default async function WallpaperPage({ params }: WallpaperPageProps) {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);

  if (!wallpaper) {
    notFound();
  }

  const relatedWallpapers = await getRelatedWallpapers(
    wallpaper.category,
    wallpaper.slug || wallpaper.id,
    8
  );

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiwallpapershub.com';
  const pageUrl = `${baseUrl}/wallpaper/${wallpaper.slug || wallpaper.id}`;
  const imageUrl = wallpaper.imageUrl || wallpaper.thumbnailUrl;

  // 3. Valid JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageObject',
        '@id': `${pageUrl}#image`,
        name: wallpaper.title,
        description: wallpaper.description,
        contentUrl: imageUrl,
        thumbnailUrl: wallpaper.thumbnailUrl || imageUrl,
        url: pageUrl,
        width: wallpaper.resolution?.split('x')?.[0]?.trim() || '3840',
        height: wallpaper.resolution?.split('x')?.[1]?.trim() || '2160',
        encodingFormat: 'image/jpeg',
        uploadDate: wallpaper.createdAt || new Date().toISOString().split('T')[0],
        caption: `${wallpaper.title} - 4K Wallpaper`,
        creditText: 'AI Wallpapers Hub',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${wallpaper.category} Wallpapers`,
            item: `${baseUrl}/?category=${encodeURIComponent(wallpaper.category)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: wallpaper.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-transparent text-[#0B1F4D] flex flex-col selection:bg-[#2D8CFF] selection:text-white">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header Navigation */}
      <header className="sticky top-3 z-50 px-3 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <div className="glass-navbar-desktop rounded-full px-5 py-3 flex items-center justify-between shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="premium-logo-mark group-hover:scale-105 transition-transform duration-300">
              <div className="premium-logo-w">W</div>
            </div>
            <span className="premium-brand-name text-base sm:text-lg font-extrabold tracking-tight">
              Wallpapers<span className="premium-brand-dot">.</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-[#0B1F4D] border border-slate-200 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Wallpapers</span>
          </Link>
        </div>
      </header>

      {/* Header Ad Slot */}
      <div className="pt-4">
        <HeaderAd />
      </div>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-3 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-[#178DFF] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link
            href={`/?category=${encodeURIComponent(wallpaper.category)}`}
            className="hover:text-[#178DFF] transition-colors"
          >
            {wallpaper.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[#0B1F4D] font-bold line-clamp-1">
            {wallpaper.title}
          </span>
        </nav>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Wallpaper Viewport */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="relative rounded-[32px] overflow-hidden bg-slate-900 shadow-2xl border border-white/80 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={`${wallpaper.title} - 4K Wallpaper Download`}
                className="w-full h-auto max-h-[82vh] object-contain"
                width={1920}
                height={1080}
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Right Column: Metadata & Action Card */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white/85 backdrop-blur-xl border border-white/90 rounded-[32px] p-6 sm:p-8 shadow-xl shadow-sky-900/5 space-y-6">
            <div>
              {/* Category Pill */}
              <Link
                href={`/?category=${encodeURIComponent(wallpaper.category)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#178DFF] border border-blue-200/60 text-xs font-extrabold mb-3 hover:bg-blue-100 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>{wallpaper.category}</span>
              </Link>

              {/* Title & Description */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F4D] tracking-tight leading-tight">
                {wallpaper.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-3 leading-relaxed">
                {wallpaper.description}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-center gap-2.5">
                <Monitor className="w-4 h-4 text-[#178DFF] shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                    Resolution
                  </div>
                  <div className="font-extrabold text-[#0B1F4D]">
                    {wallpaper.resolution || '3840 x 2160 (4K)'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-sky-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                    Views
                  </div>
                  <div className="font-extrabold text-[#0B1F4D]">
                    {(wallpaper.views || 100).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                    Downloads
                  </div>
                  <div className="font-extrabold text-[#0B1F4D]">
                    {(wallpaper.downloads || 10).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                    Published
                  </div>
                  <div className="font-extrabold text-[#0B1F4D]">
                    {wallpaper.createdAt || '2026-08-01'}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallpaper Tags */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tags &amp; Keywords
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(wallpaper.tags || [wallpaper.category]).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-slate-100/80 text-slate-600 text-[11px] font-semibold flex items-center gap-1 border border-slate-200/60"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Box if AI Generated */}
            {wallpaper.prompt && (
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs">
                <div className="text-[#178DFF] font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Prompt
                </div>
                <p className="text-slate-600 text-[11px] font-mono leading-relaxed">
                  {wallpaper.prompt}
                </p>
              </div>
            )}

            {/* Interactive Download & Favorite Actions */}
            <WallpaperDetailActions wallpaper={wallpaper} />
          </div>
        </div>

        {/* Related Wallpapers Section */}
        {relatedWallpapers.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-[#0B1F4D] tracking-tight">
                  Related {wallpaper.category} Wallpapers
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Explore more ultra high-definition 4K backgrounds in this category.
                </p>
              </div>
              <Link
                href={`/?category=${encodeURIComponent(wallpaper.category)}`}
                className="text-xs font-bold text-[#178DFF] hover:underline"
              >
                View all {wallpaper.category} &rarr;
              </Link>
            </div>

            <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
              {relatedWallpapers.map((item) => (
                <WallpaperCard key={item.id} wallpaper={item} onSelect={() => {}} />
              ))}
            </div>
          </section>
        )}

        <div className="pt-8">
          <FooterAd />
        </div>
      </main>

      {/* Global Footer */}
      <footer className="mt-auto bg-white/55 backdrop-blur-xl border-t border-white/80 py-12 text-[#46617D] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#0B1F4D] font-bold text-lg">
                <Sparkles className="w-5 h-5 text-[#2D8CFF]" />
                Wallpapers Hub
              </div>
              <p className="text-[#5F7893] max-w-md">
                Your primary source for high quality 4K and Ultra HD wallpapers for Desktop, Laptop, and Smartphones.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[#46617D] font-medium">
              <Link href="/privacy-policy" className="hover:text-[#178DFF] transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-[#178DFF] transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3" /> Terms of Service
              </Link>
              <Link href="/about" className="hover:text-[#178DFF] transition-colors flex items-center gap-1">
                <Info className="w-3 h-3" /> About Us
              </Link>
              <Link href="/contact" className="hover:text-[#178DFF] transition-colors flex items-center gap-1">
                <Info className="w-3 h-3" /> Contact Us
              </Link>
              <Link href="/disclaimer" className="hover:text-[#178DFF] transition-colors flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Disclaimer
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900/10 flex flex-col sm:flex-row items-center justify-between text-slate-600 gap-4 text-[11px]">
            <div>&copy; {new Date().getFullYear()} Wallpapers Hub. All rights reserved.</div>
            <div>Built for High Speed &amp; Technical SEO.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}