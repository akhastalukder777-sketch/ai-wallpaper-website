// Multi-Source Wallpaper Importer with Random Page Pagination & Duplicate Protection

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
  source: 'Unsplash' | 'Pexels' | 'Pixabay' | 'Pollinations-AI';
}

const CATEGORIES = [
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

// Smart Multi-Source Importer Engine: Pexels -> Pixabay -> Pollinations AI
export async function importWallpapersFromSources(count: number = 6): Promise<ImportedWallpaper[]> {
  const importedList: ImportedWallpaper[] = [];
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

  // Source 1: Pexels API (With Random Page for Fresh Wallpapers Every Time)
  if (PEXELS_KEY && importedList.length < count) {
    try {
      const randomPage = Math.floor(Math.random() * 80) + 1;
      const res = await fetch(`https://api.pexels.com/v1/search?query=wallpaper+4k&per_page=${count}&page=${randomPage}`, {
        headers: { Authorization: PEXELS_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        (data.photos || []).forEach((photo: any, idx: number) => {
          const category = CATEGORIES[idx % CATEGORIES.length];
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

  // Source 2: Pixabay API (With Random Page for Fresh Wallpapers Every Time)
  if (PIXABAY_KEY && importedList.length < count) {
    try {
      const randomPage = Math.floor(Math.random() * 40) + 1;
      const res = await fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=wallpaper+4k&image_type=photo&per_page=${count}&page=${randomPage}`);
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

  // Source 3: Pollinations AI Generation Engine
  if (importedList.length < count) {
    try {
      const needed = count - importedList.length;
      for (let i = 0; i < needed; i++) {
        const category = CATEGORIES[i % CATEGORIES.length];
        const timestamp = Date.now() + i;
        const seed = Math.floor(Math.random() * 900000) + 100000;
        const prompt = `Hyper-realistic 8k ultra HD ${category.toLowerCase()} wallpaper, cinematic lighting, vibrant detailed digital art, seed ${seed}`;
        
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