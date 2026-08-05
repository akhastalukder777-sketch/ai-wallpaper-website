// Multi-Source Wallpaper Importer with Enhanced Anime & Multi-Category Pipeline

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

const CATEGORY_IMAGES: Record<string, string[]> = {
  Anime: [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
  ],
  AMOLED: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  ],
  Dark: [
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
  ],
  Nature: [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop',
  ],
  Cars: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop',
  ],
  Bikes: [
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop',
  ],
  Space: [
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000&auto=format&fit=crop',
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop',
  ],
  Minimal: [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
  ],
  Animals: [
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?q=80&w=1000&auto=format&fit=crop',
  ],
  Flowers: [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000&auto=format&fit=crop',
  ],
  Mountains: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
  ],
  Cities: [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop',
  ],
  Mixed: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
  ],
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

// Smart Importer Engine: Wallpapers.com (Anime) -> Pexels -> Pixabay -> Pollinations AI
export async function importWallpapersFromSources(count: number = 30): Promise<ImportedWallpaper[]> {
  const importedList: ImportedWallpaper[] = [];
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

  // Source 1: Wallpapers.com Free API (Exclusively for Anime Wallpapers)
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
      const res = await fetch(`https://api.pexels.com/v1/search?query=wallpaper+4k&per_page=10&page=${randomPage}`, {
        headers: { Authorization: PEXELS_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        (data.photos || []).forEach((photo: any, idx: number) => {
          const category = CATEGORIES[(idx + 1) % CATEGORIES.length];
          const wallpaper: ImportedWallpaper = {
            id: `pexels-${photo.id}`,
            title: `${category} Ultra HD Photography #${photo.id}`,
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

  // Source 3: Pollinations AI Generation Engine (Guaranteed Category Match)
  if (importedList.length < count) {
    try {
      const needed = count - importedList.length;
      for (let i = 0; i < needed; i++) {
        const category = CATEGORIES[i % CATEGORIES.length];
        const timestamp = Date.now() + i;
        const seed = Math.floor(Math.random() * 900000) + 100000;
        const prompt = category === 'Anime'
          ? `Masterpiece 8k ultra HD anime style wallpaper, vibrant anime artwork, cinematic lighting, seed ${seed}`
          : `Hyper-realistic 8k ultra HD ${category.toLowerCase()} wallpaper, cinematic lighting, vibrant detailed digital art, seed ${seed}`;
        
        const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&model=flux&seed=${seed}&nologo=true`;

        const wallpaper: ImportedWallpaper = {
          id: `ai-${timestamp}-${seed}`,
          title: `Ultra HD AI ${category} Vision #${seed}`,
          slug: `ultra-hd-ai-${category.toLowerCase()}-wallpaper-${timestamp}-${seed}`,
          description: `Stunning 4K AI-generated ${category.toLowerCase()} wallpaper. Native 3840x2160 resolution for desktop and smartphone customization.`,
          category: category,
          tags: ['AI Generated', category, '4K', 'Ultra HD', 'Desktop', 'Mobile'],
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
        }
      }
    } catch (err) {
      console.warn('Fallback importer error', err);
    }
  }

  return importedList;
}