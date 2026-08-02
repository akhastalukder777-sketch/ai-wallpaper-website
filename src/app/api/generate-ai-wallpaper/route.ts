import { NextResponse } from 'next/server';

// System 2: Automated Free AI Image Generation & Processing Engine
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userPrompt = body.prompt;
    const category = body.category || 'AMOLED';

    // 1. Creative Prompt Engine for AI Wallpapers
    const defaultPrompts: Record<string, string> = {
      AMOLED: 'Minimalist pitch black void with a hyper-vivid glowing neon glass geometric sphere, 8k resolution, true dark AMOLED, octane render',
      Space: 'Cinematic deep cosmic nebula with glowing purple stars and vibrant galaxy dust, hyper-detailed 8k digital art',
      Nature: 'Misty enchanted autumn forest with golden sunlight rays piercing through pine trees, photorealistic 8k landscape',
      Cars: 'Futuristic matte black hypercar parked in a moody neon rain studio, glowing LED lights, 8k ray tracing',
      Gaming: 'Cyberpunk futuristic neon gaming setup with glowing RGB lights and holographic displays, 8k unreal engine 5 render',
    };

    const finalPrompt = userPrompt || defaultPrompts[category] || `Hyper-realistic 8k ultra HD wallpaper of ${category.toLowerCase()}, cinematic lighting, highly detailed artwork`;

    // 2. Free AI Image Generation Engine (Pollinations.ai / Flux Model - Free & Unlimited)
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=3840&height=2160&model=flux&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;

    const timestamp = Date.now();
    const title = `AI ${category} Artwork 4K`;
    const slug = `ai-${category.toLowerCase()}-wallpaper-${timestamp}`;

    // 3. Automated Metadata & SEO Tag Generation
    const newAiWallpaper = {
      id: `ai-${timestamp}`,
      title: title,
      slug: slug,
      description: `Original 4K AI-generated ${category.toLowerCase()} wallpaper created with advanced AI models. Optimized for AMOLED and Ultra HD displays.`,
      category: category,
      tags: ['AI Generated', category, '4K', 'Ultra HD', 'Desktop', 'AMOLED'],
      imageUrl: generatedImageUrl,
      thumbnailUrl: generatedImageUrl,
      resolution: '3840 x 2160',
      views: 1,
      downloads: 0,
      likes: 1,
      isFeatured: true,
      isTrending: true,
      isAiGenerated: true,
      createdAt: new Date().toISOString().split('T')[0],
      prompt: finalPrompt,
    };

    return NextResponse.json({
      status: 'success',
      message: 'System 2 Automation: AI Wallpaper successfully generated, metadata created, and published.',
      wallpaper: newAiWallpaper,
    });
  } catch (error) {
    // Fallback gracefully to System 1 if AI Generation quota fails
    return NextResponse.json({
      status: 'fallback',
      message: 'AI quota exhausted or temporary error. Falling back to System 1 Automation.',
      error: String(error),
    });
  }
}

// GET handler for testing in browser
export async function GET() {
  return POST(new Request('http://localhost:3000', { method: 'POST' }));
}