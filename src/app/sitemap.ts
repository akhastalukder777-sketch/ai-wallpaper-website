import { MetadataRoute } from 'next';
import { INITIAL_WALLPAPERS } from '../data/wallpapers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aiwallpapershub.com';

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

  // Add individual wallpapers to sitemap for maximum Google Image SEO
  const wallpaperRoutes = INITIAL_WALLPAPERS.map((wallpaper) => ({
    url: `${baseUrl}/#${wallpaper.slug}`,
    lastModified: new Date(wallpaper.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...wallpaperRoutes];
}