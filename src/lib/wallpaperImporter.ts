// Maximum Daily Multi-Source Importer with Category-Exact Matching

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
  source: 'Unsplash' | 'Pexels' | 'Pixabay' | 'Pollinations-AI' | 'Wallpapers.com';
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

const CATEGORY_SEARCH_QUERIES: Record<string, string> = {
  Anime: 'anime wallpaper 4k',
  AMOLED: 'amoled dark OLED black 4k',
  Dark: 'dark aesthetic black 4k',
  Nature: 'nature landscape 4k',
  Cars: 'supercar sports car 4k',
  Bikes: 'motorcycle superbike 4k',
  Space: 'space galaxy nebula 4k',
  Gaming: 'gaming setup neon 4k',
  Minimal: 'minimalist simple wallpaper 4k',
  Technology: 'technology cyber digital 4k',
  Animals: 'wildlife animal 4k',
  Flowers: 'blooming flower flora 4k',
  Mountains: 'mountain peak landscape 4k',
  Cities: 'city skyline night 4k',
  Mixed: 'abstract colorful art 4k',
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

// Smart Importer Engine: Guaranteed 100% Unique Wallpapers & Strict Anime Matching
export async function importWallpapersFromSources(count: number = 30): Promise<ImportedWallpaper[]> {
  const importedList: ImportedWallpaper[] = [];
  const PEXELS_KEY = process.env.PEXELS_API_KEY;

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const timestamp = Date.now();
    const seed = Math.floor(Math.random() * 900000) + 100000;
    const randomPage = Math.floor(Math.random() * 50) + 1;
    let imported = false;

    // 1. Anime Category: ONLY Wallpapers.com Anime API or Pure Anime AI Illustration
    if (category === 'Anime') {
      try {
        const res = await fetch(`https://wallpapers.com/api/v1/keyword/anime?limit=15`, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.wallpapers || data.data || []);
          const item = items[i % (items.length || 1)];
          if (item && (item.high || item.thumb)) {
            const itemId = item.id || seed;
            const rawTitle = item.title || item.alt || 'Anime Ultra HD 4K Wallpaper';
            const wallpaper: ImportedWallpaper = {
              id: `wpc-anime-${itemId}`,
              title: rawTitle.length > 55 ? `${rawTitle.slice(0, 52)}...` : rawTitle,
              slug: `wallpaperscom-anime-${itemId}`,
              description: `High resolution 4K Anime wallpaper free download from Wallpapers.com.`,
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
              imported = true;
            }
          }
        }
      } catch (err) {
        console.warn('Anime API error', err);
      }

      // Guaranteed AI Anime Fallback
      if (!imported) {
        const prompt = `Masterpiece 8k ultra HD anime style wallpaper, anime character artwork, vibrant anime background, seed ${seed}`;
        const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&model=flux&seed=${seed}&nologo=true`;
        const wallpaper: ImportedWallpaper = {
          id: `ai-anime-${seed}`,
          title: `Anime Ultra HD Art #${seed}`,
          slug: `ai-anime-wallpaper-${seed}`,
          description: `Stunning 4K AI-generated Anime wallpaper.`,
          category: 'Anime',
          tags: ['Anime', '4K', 'Ultra HD', 'AI Generated'],
          imageUrl: aiImageUrl,
          thumbnailUrl: aiImageUrl,
          resolution: '3840 x 2160',
          views: Math.floor(Math.random() * 3000) + 500,
          downloads: Math.floor(Math.random() * 1200) + 150,
          likes: Math.floor(Math.random() * 400) + 50,
          isFeatured: true,
          isTrending: true,
          isAiGenerated: true,
          createdAt: new Date().toISOString().split('T')[0],
          prompt: prompt,
          source: 'Pollinations-AI',
        };
        if (!isDuplicate(wallpaper, importedList)) {
          importedList.push(wallpaper);
          imported = true;
        }
      }
    }

    // 2. Photography Categories: Pexels API (Deterministic ID prevents duplicates!)
    if (!imported && PEXELS_KEY) {
      try {
        const searchQuery = CATEGORY_SEARCH_QUERIES[category] || `${category} wallpaper 4k`;
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=5&page=${randomPage}`,
          { headers: { Authorization: PEXELS_KEY } }
        );
        if (res.ok) {
          const data = await res.json();
          const photo = data.photos?.[0];
          if (photo) {
            const altTitle = photo.alt && photo.alt.trim().length > 3 ? photo.alt.trim() : `${category} 4K Ultra HD Photography`;
            const wallpaper: ImportedWallpaper = {
              id: `pexels-${photo.id}`, // Deterministic ID prevents Supabase duplicates!
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
            }
          }
        }
      } catch (err) {
        console.warn('Pexels category query error', err);
      }
    }
  }

  return importedList;
}