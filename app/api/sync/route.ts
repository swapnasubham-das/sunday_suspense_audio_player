import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Story } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST() {
  return handleSync();
}

export async function GET() {
  return handleSync();
}

async function handleSync() {
  return new Promise<Response>((resolve) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'fetch_playlist.py');
    const pythonCmd = `python "${scriptPath}"`;

    const beforeFilePath = path.join(process.cwd(), 'data', 'content.json');
    let oldCount = 0;
    let oldLatestId = '';
    if (fs.existsSync(beforeFilePath)) {
      try {
        const oldData: Story[] = JSON.parse(fs.readFileSync(beforeFilePath, 'utf-8'));
        oldCount = oldData.length;
        oldLatestId = oldData[0]?.id || '';
      } catch {}
    }

    exec(pythonCmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        return resolve(
          NextResponse.json({
            success: false,
            error: error.message,
            stderr,
          }, { status: 500 })
        );
      }

      // Read newly saved content
      let newCount = oldCount;
      let newLatestStory: Story | null = null;
      let isNewRelease = false;

      if (fs.existsSync(beforeFilePath)) {
        try {
          const newData: Story[] = JSON.parse(fs.readFileSync(beforeFilePath, 'utf-8'));
          newCount = newData.length;
          newLatestStory = newData[0] || null;
          isNewRelease = Boolean(newLatestStory && newLatestStory.id !== oldLatestId);
        } catch {}
      }

      return resolve(
        NextResponse.json({
          success: true,
          message: 'Playlist synced successfully!',
          totalStories: newCount,
          newStoriesCount: Math.max(0, newCount - oldCount),
          isNewRelease,
          latestStory: newLatestStory,
          syncedAt: new Date().toISOString(),
          stdout,
        })
      );
    });
  });
}
