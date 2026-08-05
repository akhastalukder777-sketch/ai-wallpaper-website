import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aiwallpapershub.com'),
  title: {
    default: 'AI Wallpapers Hub - Free 4K & Ultra HD AI Wallpapers',
    template: '%s | AI Wallpapers Hub',
  },
  description:
    'Download free high-resolution 4K & Ultra HD AI generated wallpapers for Desktop, Laptop, iPhone, Android, AMOLED & OLED screens. Updated daily.',
  keywords: [
    '4K Wallpapers',
    'AI Wallpapers',
    'Ultra HD Wallpapers',
    'AMOLED Wallpapers',
    'Dark Wallpapers',
    'Desktop Backgrounds',
    'Phone Wallpapers',
    'Free 4K Wallpapers',
  ],
  authors: [{ name: 'AI Wallpapers Hub Team' }],
  creator: 'AI Wallpapers Hub',
  publisher: 'AI Wallpapers Hub',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiwallpapershub.com',
    title: 'AI Wallpapers Hub - Free 4K & Ultra HD AI Wallpapers',
    description:
      'Discover and download original 4K AI-generated wallpapers for smartphone and desktop display customization.',
    siteName: 'AI Wallpapers Hub',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'AI Wallpapers Hub - 4K Ultra HD Wallpapers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Wallpapers Hub - Free 4K & Ultra HD AI Wallpapers',
    description:
      'Download free high-resolution 4K AI wallpapers for Desktop and Smartphones.',
    images: ['https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema markup for Google Search Engine (JSON-LD)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Wallpapers Hub',
    url: 'https://aiwallpapershub.com',
    description: 'Free 4K & Ultra HD AI Generated Wallpapers for Desktop and Mobile',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://aiwallpapershub.com/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Structured Data / Schema Markup for Google SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
         {/* Adsterra Live Popunder Monetization Script */}
        <script src="https://delvefencescrewdriver.com/81/76/55/817655ea60fd547b547e4fc1f9c49737.js"></script>

      </head>
      <body className="antialiased bg-[#090d16] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}