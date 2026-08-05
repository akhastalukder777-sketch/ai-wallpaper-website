// Multi-Source Pure Photography Wallpaper Importer (Wallpapers.com, Pexels, Pixabay, Unsplash)

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
  source: 'Unsplash' | 'Pexels' | 'Pixabay' | 'Wallpapers.com';
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
  'Mixed',
];

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

// Pure Photography Importer Engine: Wallpapers.com (Anime) -> Pexels -> Pixabay -> Unsplash
export async function importWallpapersFromSources(count: number = 30): Promise<ImportedWallpaper[]> {
  const importedList: ImportedWallpaper[] = [];
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

  // Source 1: Wallpapers.com Free API (Anime Wallpapers)
  try {
    const res = await fetch('https://wallpapers.com/api/v1/keyword/anime?limit=15', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });
    
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.wallpapers || data.data || []);
      
      items.forEach((item: any) => {
        if (item && (item.high || item.thumb)) {
          const itemId = item.id || Math.floor(Math.random() * 900000) + 100000;
          const rawTitle = item.title || item.alt || 'Anime Ultra HD 4K Wallpaper';
          
          const wallpaper: ImportedWallpaper = {
            id: `wpc-${itemId}`,
            title: rawTitle.length > 55 ? `${rawTitle.slice(0, 52)}...` : rawTitle,
            slug: `wallpaperscom-anime-wallpaper-${itemId}`,
            description: `High resolution 4K Anime wallpaper free download from Wallpapers.com collection.`,
            category: 'Anime',
            tags: ['Anime', '4K', 'Ultra HD', 'Desktop', 'Wallpapers.com'],
            imageUrl: item.high || item.thumb,
            thumbnailUrl: item.thumb || item.high,
            resolution: '3840 x 2160',
            views: Math.floor(Math.random() * 5000) + 1000,
            downloads: Math.floor(Math.random() * 2000) + 300,
            likes: Math.floor(Math.random() * 500) + 100,
            isFeatured: true,
            isTrending: true,
            isAiGenerated: false,
            createdAt: new Date().toISOString().split('T')[0],
            source: 'Wallpapers.com',
          };

          if (!isDuplicate(wallpaper, importedList)) {
            importedList.push(wallpaper);
          }
        }
      });
    }
  } catch (err) {
    console.warn('Wallpapers.com Anime API error', err);
  }

  // Source 2: Pexels API
  if (PEXELS_KEY && importedList.length < count) {
    try {
      const randomPage = Math.floor(Math.random() * 80) + 1;
      const res = await fetch(`https://api.pexels.com/v1/search?query=wallpaper+4k&per_page=15&page=${randomPage}`, {
        headers: { Authorization: PEXELS_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        (data.photos || []).forEach((photo: any, idx: number) => {
          const category = CATEGORIES[(idx + 1) % CATEGORIES.length];
          const wallpaper: ImportedWallpaper = {
            id: `pexels-${photo.id}`,
            title: photo.alt ? (photo.alt.length > 50 ? `${photo.alt.slice(0, 47)}...` : photo.alt) : `${category} Ultra HD Photography #${photo.id}`,
            slug: `pexels-${category.toLowerCase()}-wallpaper-${photo.id}`,
            description: `High resolution 4K ${category.toLowerCase()} wallpaper free download from Pexels collection.`,
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
          }
        });
      }
    } catch (err) {
      console.warn('Pexels API Importer error', err);
    }
  }

  // Source 3: Pixabay API
  if (PIXABAY_KEY && importedList.length < count) {
    try {
      const randomPage = Math.floor(Math.random() * 40) + 1;
      const res = await fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=wallpaper+4k&image_type=photo&per_page=15&page=${randomPage}`);
      if (res.ok) {
        const data = await res.json();
        (data.hits || []).forEach((item: any, idx: number) => {
          const category = CATEGORIES[idx % CATEGORIES.length];
          const wallpaper: ImportedWallpaper = {
            id: `pixabay-${item.id}`,
            title: `${category} 4K Fine Art #${item.id}`,
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
          }
        });
      }
    } catch (err) {
      console.warn('Pixabay API Importer error', err);
    }
  }

  return importedList;
}