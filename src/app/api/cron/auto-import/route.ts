
import { NextResponse } from 'next/server';
import { importWallpapersFromSources } from '../../../../lib/wallpaperImporter';
import { saveWallpapersToDb } from '../../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    const CRON_SECRET = process.env.CRON_SECRET || 'ai-wallpaper-secret-key';

    // Allow Vercel Cron system header OR valid secret key parameter
    if (process.env.NODE_ENV === 'production' && !isVercelCron && secret !== CRON_SECRET) {
      return NextResponse.json({ status: 'unauthorized', message: 'Invalid Cron Secret Key' }, { status: 401 });
    }

    // Run multi-source auto-importer (Pollinations AI, Unsplash, Pexels, Pixabay)
    const importedWallpapers = await importWallpapersFromSources(6);

    // Save permanently to Supabase DB Persistence Engine
    await saveWallpapersToDb(importedWallpapers);

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'Daily Cron Automation executed: Multi-source wallpapers imported, duplicate checked, and published.',
      importedCount: importedWallpapers.length,
      wallpapers: importedWallpapers,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Cron Execution Failed', error: String(error) },
      { status: 500 }
    );
  }
}