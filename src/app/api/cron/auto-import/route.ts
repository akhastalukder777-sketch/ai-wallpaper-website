import { NextResponse } from 'next/server';
import { importWallpapersFromSources } from '../../../../lib/wallpaperImporter';
import { saveWallpapersToDb } from '../../../../lib/db';

export const maxDuration = 15; // Max serverless execution time for Vercel

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const reqCount = Number(searchParams.get('count')) || 30; // Default 30 per run
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    const CRON_SECRET = process.env.CRON_SECRET || 'ai-wallpaper-secret-key';

    // Security Authorization Check
    if (process.env.NODE_ENV === 'production' && !isVercelCron && secret !== CRON_SECRET) {
      return NextResponse.json({ status: 'unauthorized', message: 'Invalid Cron Secret Key' }, { status: 401 });
    }

    // Run multi-source auto-importer with 30-50 count per run
    const importedWallpapers = await importWallpapersFromSources(Math.min(reqCount, 50));

    // Save permanently to Supabase DB Persistence Engine
    await saveWallpapersToDb(importedWallpapers);

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: `Daily Cron Automation executed: ${importedWallpapers.length} wallpapers imported, duplicate checked, and published.`,
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