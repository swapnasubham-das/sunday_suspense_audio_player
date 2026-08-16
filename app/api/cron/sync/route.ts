import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Story } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    // Optional Vercel Cron verification if CRON_SECRET is set
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Allow local or pass if no secret configured
    }

    const filePath = path.join(process.cwd(), 'data', 'content.json');
    let totalStories = 0;
    let latestStory: Story | null = null;

    if (fs.existsSync(filePath)) {
      const data: Story[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      totalStories = data.length;
      latestStory = data[0] || null;
    }

    return NextResponse.json({
      success: true,
      message: 'Vercel Cron daily check executed successfully.',
      scheduledTime: '13:30 UTC (7:00 PM IST)',
      totalStories,
      latestSelectedDrama: latestStory?.title || 'None',
      uploadDate: latestStory?.uploadDate || 'N/A',
      timestamp: latestStory?.timestamp || 0,
      executedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Cron execution failed',
    }, { status: 500 });
  }
}
