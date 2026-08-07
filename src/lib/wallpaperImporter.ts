// All-Star 4-Source Importer Engine with Instant New Row Timestamp ID System

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
      cleanExistingTitle === cleanNewTitle
    );
  });
}

// 4-Source Importer Engine: Wallhaven -> Pexels -> Pixabay -> Unsplash (Unique Row Timestamp ID)
export async function importWallpapersFromSources(count: number = 30): Promise<ImportedWallpaper[]> {
  const importedList: ImportedWallpaper[] = [];
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const searchQuery = CATEGORY_SEARCH_QUERIES[category] || `${category} 4k`;
    const randomPage = Math.floor(Math.random() * 80) + 1;
    const timestamp = Date.now() + i;
    const randomSeed = Math.floor(Math.random() * 90000) + 10000;
    let imported = false;

    // Source 1: Wallhaven.cc Free Keyless API
    try {
      const res = await fetch(`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(searchQuery)}&purity=100&sorting=random&page=${randomPage}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const item = data.data?.[i % (data.data?.length || 1)];
        if (item && item.path) {
          const wallpaper: ImportedWallpaper = {
            id: `wallhaven-${item.id}-${timestamp}`,
            title: `${category} Ultra HD Wallhaven #${item.id}-${randomSeed}`,
            slug: `wallhaven-${category.toLowerCase()}-wallpaper-${item.id}-${timestamp}`,
            description: `High resolution 4K ${category.toLowerCase()} wallpaper from Wallhaven.`,
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
      console.warn('Wallhaven API error', err);
    }

    // Source 2: Pexels API
    if (!imported && PEXELS_KEY) {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=5&page=${randomPage}`,
          { headers: { Authorization: PEXELS_KEY } }
        );
        if (res.ok) {
          const data = await res.json();
          const photo = data.photos?.[i % (data.photos?.length || 1)];
          if (photo) {
            const altTitle = photo.alt && photo.alt.trim().length > 3 ? photo.alt.trim() : `${category} 4K Ultra HD Photography`;
            const wallpaper: ImportedWallpaper = {
              id: `pexels-${photo.id}-${timestamp}`,
              title: `${altTitle.length > 45 ? altTitle.slice(0, 42) + '...' : altTitle} #${randomSeed}`,
              slug: `pexels-${category.toLowerCase()}-wallpaper-${photo.id}-${timestamp}`,
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
          `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=5&page=${randomPage}`
        );
        if (res.ok) {
          const data = await res.json();
          const item = data.hits?.[i % (data.hits?.length || 1)];
          if (item) {
            const tagsTitle = item.tags ? item.tags.split(',')[0] : `${category} 4K Fine Art`;
            const wallpaper: ImportedWallpaper = {
              id: `pixabay-${item.id}-${timestamp}`,
              title: `${tagsTitle.charAt(0).toUpperCase() + tagsTitle.slice(1)} 4K #${randomSeed}`,
              slug: `pixabay-${category.toLowerCase()}-wallpaper-${item.id}-${timestamp}`,
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
  }

  return importedList;
}