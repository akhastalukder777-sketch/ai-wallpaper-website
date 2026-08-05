export interface Wallpaper {
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
  isFeatured?: boolean;
  isTrending?: boolean;
  isAiGenerated?: boolean;
  createdAt: string;
  prompt?: string;
}

export const CATEGORIES = [
  'All',
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
] as const;

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  {
    id: '1',
    title: 'Neon Cyberpunk Futuristic City Night',
    slug: 'neon-cyberpunk-futuristic-city-night',
    description: 'Stunning 4K wallpaper depicting a futuristic cyberpunk metropolis illuminated by glowing neon signs and rainy reflections.',
    category: 'Cities',
    tags: ['Cyberpunk', 'Neon', 'City', '4K', 'Night', 'Futuristic'],
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop',
    resolution: '3840 x 2160',
    views: 14200,
    downloads: 5820,
    likes: 1240,
    isFeatured: true,
    isTrending: true,
    isAiGenerated: false,
    createdAt: '2026-07-28',
  },
  {
    id: '2',
    title: 'Deep Cosmic Nebula & Galaxies',
    slug: 'deep-cosmic-nebula-galaxies',
    description: 'Breathtaking high-resolution space wallpaper featuring deep space nebulas, distant stars, and vibrant purple-blue cosmic dust.',
    category: 'Space',
    tags: ['Space', 'Galaxy', 'Nebula', 'Stars', '4K', 'Cosmic'],
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop',
    resolution: '3840 x 2160',
    views: 18900,
    downloads: 8100,
    likes: 2150,
    isFeatured: true,
    isTrending: true,
    isAiGenerated: false,
    createdAt: '2026-07-29',
  },
  {
    id: '3',
    title: 'Minimalist Glowing AMOLED Sphere',
    slug: 'minimalist-glowing-amoled-sphere',
    description: 'Pitch black background with a vivid glowing neon glass sphere. Specially optimized for AMOLED and OLED smartphone and desktop screens.',
    category: 'AMOLED',
    tags: ['AMOLED', 'Minimal', 'Dark', 'OLED', 'Abstract', '3D'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    resolution: '3840 x 2160',
    views: 22400,
    downloads: 11300,
    likes: 3400,
    isFeatured: true,
    isTrending: true,
    isAiGenerated: false,
    createdAt: '2026-07-30',
  },
  {
    id: '4',
    title: 'Misty Alpine Mountain Peak Sunset',
    slug: 'misty-alpine-mountain-peak-sunset',
    description: 'Serene landscape featuring snow-capped mountain peaks rising above thick clouds bathed in warm golden sunset light.',
    category: 'Mountains',
    tags: ['Mountains', 'Nature', 'Sunset', 'Landscape', 'Fog', 'Clouds'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
    resolution: '3840 x 2160',
    views: 9500,
    downloads: 3800,
    likes: 890,
    isFeatured: false,
    isTrending: true,
    isAiGenerated: false,
    createdAt: '2026-07-31',
  },
  {
    id: '5',
    title: 'Futuristic Matte Black Supercar Concept',
    slug: 'futuristic-matte-black-supercar-concept',
    description: 'Sleek matte black sports car with sharp LED headlights under dramatic studio light reflections.',
    category: 'Cars',
    tags: ['Cars', 'Supercar', 'Dark', 'Automotive', 'Speed', 'Luxury'],
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    resolution: '3840 x 2160',
    views: 16200,
    downloads: 7400,
    likes: 1820,
    isFeatured: true,
    isTrending: false,
    isAiGenerated: false,
    createdAt: '2026-08-01',
  },
  {
    id: '6',
    title: 'Minimal Forest Pines in Fog',
    slug: 'minimal-forest-pines-in-fog',
    description: 'Calm and moody dark forest foggy pine trees wallpaper for a clean minimal desktop aesthetic.',
    category: 'Minimal',
    tags: ['Minimal', 'Forest', 'Dark', 'Nature', 'Trees', 'Moody'],
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1920&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop',
    resolution: '3840 x 2160',
    views: 11300,
    downloads: 4900,
    likes: 1050,
    isFeatured: false,
    isTrending: false,
    isAiGenerated: false,
    createdAt: '2026-08-01',
  }
];