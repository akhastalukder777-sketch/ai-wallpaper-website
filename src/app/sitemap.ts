// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getWallpapersFromDb } from '../lib/db';
import { INITIAL_WALLPAPERS } from '../data/wallpapers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiwallpapershub.com';

  // 1. Base essential static routes
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

  // 2. Fetch all wallpapers from Supabase database
  const dbWallpapers = await getWallpapersFromDb();
  const wallpapers = dbWallpapers.length > 0 ? dbWallpapers : INITIAL_WALLPAPERS;

  // 3. Prevent duplicate URLs using a Set
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