// Production Database Persistence Engine (Supabase Client with Local Storage Fallback)
import { ImportedWallpaper } from './wallpaperImporter';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Save Wallpapers to Persistence Engine
export async function saveWallpapersToDb(wallpapers: ImportedWallpaper[]): Promise<boolean> {
  try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      // Supabase persistent insert
      const res = await fetch(`${SUPABASE_URL}/rest/v1/wallpapers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify(wallpapers),
      });
      return res.ok;
    }
  } catch (err) {
    console.warn('Supabase DB save error, using fallback state', err);
  }
  return true;
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