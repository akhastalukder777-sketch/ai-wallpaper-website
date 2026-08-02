import { NextResponse } from 'next/server';
import { importWallpapersFromSources } from '../../../../lib/wallpaperImporter';
import { saveWallpapersToDb } from '../../../../lib/db';

export async function GET(request: Request) {
  try {
    // 1. Secret authorization check for production cron jobs
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const CRON_SECRET = process.env.CRON_SECRET || 'ai-wallpaper-secret-key';

    if (process.env.NODE_ENV === 'production' && secret !== CRON_SECRET) {
      return NextResponse.json({ status: 'unauthorized', message: 'Invalid Cron Secret Key' }, { status: 401 });
    }

    // 2. Run multi-source auto-importer (Pollinations AI, Unsplash, Pexels, Pixabay)
    const importedWallpapers = await importWallpapersFromSources(6);

    // 3. Save permanently to DB Persistence Engine
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