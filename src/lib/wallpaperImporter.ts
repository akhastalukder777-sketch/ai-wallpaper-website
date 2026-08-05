// All-Star 4-Source Pure Photography & Wallhaven Importer Engine (Wallhaven, Pexels, Pixabay, Unsplash)

export interface ImportedWallpaper {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  thumbnailUrl: string;
  resolution: string;
  views: number;
  downloads: number;
  likes: number;
  isFeatured: boolean;
  isTrending: boolean;
  isAiGenerated: boolean;
  createdAt: string;
  prompt?: string;
  source: 'Unsplash' | 'Pexels' | 'Pixabay' | 'Wallhaven';
}

const CATEGORIES = [
  'Anime',
  'AMOLED',
  'Dark',
  'Nature',
  'Cars',
  'Bikes',
  'Space',
  'Gaming',
  'Minimal',
  'Technology',
  'Animals',
  'Flowers',
  'Mountains',
  'Cities',
  'Abstract',
  'Aesthetic',
  'Fantasy',
  'Cyberpunk',
  'Architecture',
  'Ocean',
  'Sunset',
  'Mixed',
];

const CATEGORY_SEARCH_QUERIES: Record<string, string> = {
  Anime: 'anime 4k wallpaper',
  AMOLED: 'amoled dark OLED black',
  Dark: 'dark aesthetic black',
  Nature: 'nature landscape',
  Cars: 'supercar sports car',
  Bikes: 'motorcycle superbike',
  Space: 'space galaxy nebula',
  Gaming: 'gaming setup neon',
  Minimal: 'minimalist simple',
  Technology: 'technology cyber digital',
  Animals: 'wildlife animal',
  Flowers: 'blooming flower flora',
  Mountains: 'mountain peak landscape',
  Cities: 'city skyline night',
  Abstract: 'abstract colorful art',
  Aesthetic: 'aesthetic chill retro',
  Fantasy: 'fantasy magical landscape',
  Cyberpunk: 'cyberpunk neon futuristic city',
  Architecture: 'modern architecture building',
  Ocean: 'deep ocean sea beach',
  Sunset: 'sunset golden hour sky',
  Mixed: 'stunning 4k wallpaper',
};

export function generateImageHash(url: string, title: string): string {
  const cleanStr = `${url.split('?')[0]}-${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  let hash = 0;
  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash-${Math.abs(hash)}`;
}

export function isDuplicate(
  newWallpaper: Partial<ImportedWallpaper>,
  existingWallpapers: ImportedWallpaper[]
): boolean {
  if (!newWallpaper.title || !newWallpaper.imageUrl) return true;
  const cleanNewTitle = newWallpaper.title.toLowerCase().trim();

  return existingWallpapers.some((existing) => {
    const cleanExistingTitle = existing.title.toLowerCase().trim();
    return (
      existing.id === newWallpaper.id ||
      existing.imageUrl === newWallpaper.imageUrl ||
      existing.slug === newWallpaper.slug ||
      cleanExistingTitle === cleanNewTitle
    );
  });
}

// 4-Source Importer Engine: Wallhaven -> Pexels -> Pixabay -> Unsplash
export async function importWallpapersFromSources(count: number = 30): Promise<ImportedWallpaper[]> {
  const importedList: ImportedWallpaper[] = [];
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const searchQuery = CATEGORY_SEARCH_QUERIES[category] || `${category} 4k`;
    const randomPage = Math.floor(Math.random() * 30) + 1;
    const timestamp = Date.now() + i;
    let imported = false;

    // Source 1: Wallhaven.cc Free Keyless API (Great for Anime, Cyberpunk, Gaming, AMOLED, Space)
    try {
      const res = await fetch(`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(searchQuery)}&purity=100&sorting=random&page=${randomPage}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const item = data.data?.[0];
        if (item && item.path) {
          const wallpaper: ImportedWallpaper = {
            id: `wallhaven-${item.id}`,
            title: `${category} Ultra HD Wallhaven #${item.id}`,
            slug: `wallhaven-${category.toLowerCase()}-wallpaper-${item.id}`,
            description: `High resolution 4K ${category.toLowerCase()} wallpaper from Wallhaven collection.`,
            category: category,
            tags: [category, '4K', 'Wallhaven', 'Desktop'],
            imageUrl: item.path,
            thumbnailUrl: item.thumbs?.large || item.thumbs?.original || item.path,
            resolution: item.resolution || '3840 x 2160',
            views: item.views || Math.floor(Math.random() * 5000) + 1000,
            downloads: item.favorites || Math.floor(Math.random() * 2000) + 300,
            likes: item.favorites || 150,
            isFeatured: true,
            isTrending: true,
            isAiGenerated: false,
            createdAt: new Date().toISOString().split('T')[0],
            source: 'Wallhaven',
          };

          if (!isDuplicate(wallpaper, importedList)) {
            importedList.push(wallpaper);
            imported = true;
          }
        }
      }
    } catch (err) {
      console.warn('Wallhaven API Importer error', err);
    }

    // Source 2: Pexels API
    if (!imported && PEXELS_KEY) {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=3&page=${randomPage}`,
          { headers: { Authorization: PEXELS_KEY } }
        );
        if (res.ok) {
          const data = await res.json();
          const photo = data.photos?.[0];
          if (photo) {
            const altTitle = photo.alt && photo.alt.trim().length > 3 ? photo.alt.trim() : `${category} 4K Ultra HD Photography`;
            const wallpaper: ImportedWallpaper = {
              id: `pexels-${photo.id}`,
              title: altTitle.length > 50 ? `${altTitle.slice(0, 47)}...` : altTitle,
              slug: `pexels-${category.toLowerCase()}-wallpaper-${photo.id}`,
              description: `High resolution 4K ${category.toLowerCase()} wallpaper free download from Pexels.`,
              category: category,
              tags: [category, '4K', 'Photography', 'Desktop', 'Pexels'],
              imageUrl: photo.src?.original || photo.src?.large2x,
              thumbnailUrl: photo.src?.large || photo.src?.medium,
              resolution: '3840 x 2160',
              views: Math.floor(Math.random() * 5000) + 1000,
              downloads: Math.floor(Math.random() * 2000) + 300,
              likes: photo.likes || 150,
              isFeatured: true,
              isTrending: true,
              isAiGenerated: false,
              createdAt: new Date().toISOString().split('T')[0],
              source: 'Pexels',
            };

            if (!isDuplicate(wallpaper, importedList)) {
              importedList.push(wallpaper);
              imported = true;
            }
          }
        }
      } catch (err) {
        console.warn('Pexels category query error', err);
      }
    }

    // Source 3: Pixabay API
    if (!imported && PIXABAY_KEY) {
      try {
        const res = await fetch(
          `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=3&page=${randomPage}`
        );
        if (res.ok) {
          const data = await res.json();
          const item = data.hits?.[0];
          if (item) {
            const tagsTitle = item.tags ? item.tags.split(',')[0] : `${category} 4K Fine Art`;
            const wallpaper: ImportedWallpaper = {
              id: `pixabay-${item.id}`,
              title: `${tagsTitle.charAt(0).toUpperCase() + tagsTitle.slice(1)} 4K`,
              slug: `pixabay-${category.toLowerCase()}-wallpaper-${item.id}`,
              description: `High resolution 4K ${category.toLowerCase()} wallpaper free download from Pixabay.`,
              category: category,
              tags: [category, '4K', 'Photography', 'Desktop', 'Pixabay'],
              imageUrl: item.largeImageURL || item.fullHDURL,
              thumbnailUrl: item.webformatURL || item.previewURL,
              resolution: '3840 x 2160',
              views: item.views || 2000,
              downloads: item.downloads || 500,
              likes: item.likes || 120,
              isFeatured: true,
              isTrending: true,
              isAiGenerated: false,
              createdAt: new Date().toISOString().split('T')[0],
              source: 'Pixabay',
            };

            if (!isDuplicate(wallpaper, importedList)) {
              importedList.push(wallpaper);
              imported = true;
            }
          }
        }
      } catch (err) {
        console.warn('Pixabay category query error', err);
      }
    }

    // Source 4: Unsplash API Fallback
    if (!imported) {
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos/random?count=1&query=${encodeURIComponent(category)},wallpaper,4k&client_id=demo`
        );
        if (res.ok) {
          const data = await res.json();
          const item = Array.isArray(data) ? data[0] : data;
          if (item && item.urls) {
            const wallpaper: ImportedWallpaper = {
              id: `unsplash-${item.id || timestamp}`,
              title: item.alt_description
                ? `${item.alt_description.charAt(0).toUpperCase() + item.alt_description.slice(1)} 4K`
                : `${category} Ultra HD Wallpaper`,
              slug: `unsplash-${category.toLowerCase()}-wallpaper-${timestamp}`,
              description: `Free high resolution 4K ${category.toLowerCase()} wallpaper from Unsplash collection.`,
              category: category,
              tags: [category, '4K', 'Photography', 'Unsplash'],
              imageUrl: item.urls?.full || item.urls?.regular,
              thumbnailUrl: item.urls?.small || item.urls?.regular,
              resolution: '3840 x 2160',
              views: Math.floor(Math.random() * 8000) + 1000,
              downloads: Math.floor(Math.random() * 3000) + 500,
              likes: Math.floor(Math.random() * 900) + 100,
              isFeatured: false,
              isTrending: true,
              isAiGenerated: false,
              createdAt: new Date().toISOString().split('T')[0],
              source: 'Unsplash',
            };

            if (!isDuplicate(wallpaper, importedList)) {
              importedList.push(wallpaper);
            }
          }
        }
      } catch (err) {
        console.warn('Unsplash API fallback error', err);
      }
    }
  }

  return importedList;
}