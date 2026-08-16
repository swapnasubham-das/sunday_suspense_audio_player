import { NextResponse } from 'next/server';

// In-memory active session registry (stores timestamp of last heartbeat)
const activeSessions = new Map<string, { lastSeen: number; storyId?: string }>();

// Expiration threshold: sessions inactive for >40 seconds are pruned
const SESSION_TIMEOUT_MS = 40 * 1000;

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, data] of activeSessions.entries()) {
    if (now - data.lastSeen > SESSION_TIMEOUT_MS) {
      activeSessions.delete(sessionId);
    }
  }
}

export async function GET(req: Request) {
  cleanupExpiredSessions();
  
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session');
  const storyId = searchParams.get('story') || undefined;

  if (sessionId) {
    activeSessions.set(sessionId, {
      lastSeen: Date.now(),
      storyId,
    });
  }

  // Count active sessions (minimum 1 for current requester)
  const onlineCount = Math.max(1, activeSessions.size);

  return NextResponse.json({
    success: true,
    onlineCount,
    timestamp: Date.now(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = body.sessionId || body.session;
    const storyId = body.storyId || undefined;
    const action = body.action;

    cleanupExpiredSessions();

    if (sessionId) {
      if (action === 'leave') {
        activeSessions.delete(sessionId);
      } else {
        activeSessions.set(sessionId, {
          lastSeen: Date.now(),
          storyId,
        });
      }
    }

    const onlineCount = Math.max(1, activeSessions.size);

    return NextResponse.json({
      success: true,
      onlineCount,
      timestamp: Date.now(),
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      onlineCount: Math.max(1, activeSessions.size),
    });
  }
}
