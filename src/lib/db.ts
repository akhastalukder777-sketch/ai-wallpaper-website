// Production Database Persistence Engine (Supabase Client)
import { ImportedWallpaper } from './wallpaperImporter';
import { Wallpaper } from '../data/wallpapers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fetch All Wallpapers from Supabase REST API (Bypassing 1000 Rows Limit)
export async function getWallpapersFromDb(): Promise<Wallpaper[]> {
  try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
      
      let allWallpapers: Wallpaper[] = [];
      let offset = 0;
      const limit = 1000;
      let hasMore = true;

      // লুপের মাধ্যমে ১০০০ করে সমস্ত ৫,৩৮০+ ডেটা ফেচ করা হচ্ছে
      while (hasMore) {
        const res = await fetch(
          `${cleanUrl}/rest/v1/wallpapers?select=*&order=createdAt.desc&limit=${limit}&offset=${offset}`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          console.warn(`Supabase fetch failed with status ${res.status}`);
          break;
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          allWallpapers = allWallpapers.concat(data as Wallpaper[]);
          
          // যদি প্রাপ্ত ডেটা ১০০০ এর কম হয়, তার মানে সব ডেটা নেওয়া শেষ
          if (data.length < limit) {
            hasMore = false;
          } else {
            offset += limit;
          }
        } else {
          hasMore = false;
        }
      }

      return allWallpapers;
    }
  } catch (err) {
    console.warn('Supabase DB fetch error', err);
  }
  return [];
}

// Save Wallpapers to Supabase Persistence Engine
export async function saveWallpapersToDb(wallpapers: ImportedWallpaper[]): Promise<boolean> {
  try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY && wallpapers.length > 0) {
      const cleanUrl = SUPABASE_URL.replace(/\/$/, '');

      const formattedWallpapers = wallpapers.map((item) => ({
        id: String(item.id),
        title: String(item.title),
        slug: String(item.slug),
        description: item.description || '',
        category: String(item.category),
        tags: Array.isArray(item.tags) ? item.tags : [item.category],
        imageUrl: String(item.imageUrl),
        thumbnailUrl: String(item.thumbnailUrl),
        resolution: item.resolution || '3840 x 2160',
        views: Number(item.views) || 100,
        downloads: Number(item.downloads) || 10,
        likes: Number(item.likes) || 5,
        isFeatured: Boolean(item.isFeatured),
        isTrending: Boolean(item.isTrending),
        isAiGenerated: Boolean(item.isAiGenerated),
        createdAt: item.createdAt || new Date().toISOString().split('T')[0],
        prompt: item.prompt || null,
        source: item.source || 'Pollinations-AI',
      }));

      const res = await fetch(`${cleanUrl}/rest/v1/wallpapers?on_conflict=id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(formattedWallpapers),
      });

      return res.ok;
    }
  } catch (err) {
    console.error('Supabase DB save catch error:', err);
  }
  return false;
}

// Favorites LocalStorage Persistence Helpers
export function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('wallpaper_favorites');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredFavorites(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('wallpaper_favorites', JSON.stringify(ids));
  } catch (err) {
    console.warn('LocalStorage save error', err);
  }
}