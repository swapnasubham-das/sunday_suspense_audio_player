import { PlaybackPosition } from './types';

const PROGRESS_KEY_PREFIX = 'raat_jaga_pos_';
const BOOKMARKS_KEY = 'raat_jaga_bookmarks';
const HISTORY_KEY = 'raat_jaga_history';
const LAST_PLAYED_KEY = 'raat_jaga_last_played';

export function savePlaybackPosition(storyId: string, positionSec: number, durationSec: number) {
  if (typeof window === 'undefined' || !storyId) return;
  try {
    const data: PlaybackPosition = {
      storyId,
      positionSec: Math.floor(positionSec),
      durationSec: Math.floor(durationSec),
      updatedAt: Date.now(),
    };
    localStorage.setItem(`${PROGRESS_KEY_PREFIX}${storyId}`, JSON.stringify(data));
    localStorage.setItem(LAST_PLAYED_KEY, storyId);

    // Update history list
    const history = getListeningHistory();
    const filtered = history.filter(id => id !== storyId);
    filtered.unshift(storyId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (e) {
    console.error('Error saving playback position:', e);
  }
}

export function getPlaybackPosition(storyId: string): PlaybackPosition | null {
  if (typeof window === 'undefined' || !storyId) return null;
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY_PREFIX}${storyId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function getAllPlaybackPositions(): Record<string, PlaybackPosition> {
  if (typeof window === 'undefined') return {};
  const results: Record<string, PlaybackPosition> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PROGRESS_KEY_PREFIX)) {
        const storyId = key.replace(PROGRESS_KEY_PREFIX, '');
        const val = localStorage.getItem(key);
        if (val) {
          results[storyId] = JSON.parse(val);
        }
      }
    }
  } catch (e) {
    console.error('Error reading all playback positions:', e);
  }
  return results;
}

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleBookmark(storyId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const bookmarks = getBookmarks();
    const index = bookmarks.indexOf(storyId);
    let updated: string[];
    if (index >= 0) {
      updated = bookmarks.filter(id => id !== storyId);
    } else {
      updated = [...bookmarks, storyId];
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function getListeningHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getLastPlayedStoryId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_PLAYED_KEY);
}

export function setLastPlayedStoryId(storyId: string): void {
  if (typeof window === 'undefined' || !storyId) return;
  try {
    localStorage.setItem(LAST_PLAYED_KEY, storyId);
  } catch (e) {}
}
