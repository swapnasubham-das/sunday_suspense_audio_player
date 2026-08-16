import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Story } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const stories: Story[] = JSON.parse(fileData);
      return NextResponse.json({
        success: true,
        count: stories.length,
        latestStory: stories[0] || null,
        stories,
      }, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
    return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
