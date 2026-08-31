// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getWallpapersFromDb } from '../lib/db';
import { INITIAL_WALLPAPERS } from '../data/wallpapers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // আপনার আসল Vercel ডোমেইন
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-wallpaper-website.vercel.app';

  // ১. স্ট্যাটিক পেজসমূহ
  const staticRoutes = [
    '',
    '/privacy-policy',
    '/terms-of-service',
    '/about',
    '/contact',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.6,
  }));

  // ২. ডাটাবেজ থেকে সমস্ত ওয়ালপেপার ফেচ
  const dbWallpapers = await getWallpapersFromDb();
  const wallpapers = dbWallpapers.length > 0 ? dbWallpapers : INITIAL_WALLPAPERS;

  // ৩. ডুপ্লিকেট লিংক বাদ দিয়ে সাইটম্যাপ তৈরি
  const seenUrls = new Set<string>();
  const wallpaperRoutes: MetadataRoute.Sitemap = [];

  for (const wallpaper of wallpapers) {
    const rawSlug = wallpaper.slug || wallpaper.id;
    if (!rawSlug) continue;

    const cleanSlug = encodeURIComponent(rawSlug.trim());
    const fullUrl = `${baseUrl}/wallpaper/${cleanSlug}`;

    if (!seenUrls.has(fullUrl)) {
      seenUrls.add(fullUrl);
      wallpaperRoutes.push({
        url: fullUrl,
        lastModified: new Date(wallpaper.createdAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...wallpaperRoutes];
}