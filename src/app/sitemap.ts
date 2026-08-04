import { MetadataRoute } from 'next';
import { getWallpapersFromDb } from '../lib/db';
import { INITIAL_WALLPAPERS } from '../data/wallpapers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-wallpaper-website.vercel.app';

  // Base essential pages
  const routes = [
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

  // Fetch wallpapers for dynamic sitemap indexing
  const dbWallpapers = await getWallpapersFromDb();
  const wallpapers = dbWallpapers.length > 0 ? dbWallpapers : INITIAL_WALLPAPERS;

  const wallpaperRoutes = wallpapers.map((wallpaper) => ({
    url: `${baseUrl}/?wallpaper=${wallpaper.slug || wallpaper.id}`,
    lastModified: new Date(wallpaper.createdAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...wallpaperRoutes];
}