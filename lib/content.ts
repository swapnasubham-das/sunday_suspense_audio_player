import contentData from '@/data/content.json';
import { Story, Genre } from './types';
import Fuse from 'fuse.js';

export const stories: Story[] = contentData as Story[];

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'titleEn', weight: 0.3 },
    { name: 'author', weight: 0.2 },
    { name: 'rawTitle', weight: 0.1 },
    { name: 'genre', weight: 0.1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
};

const fuse = new Fuse(stories, fuseOptions);

export function searchStories(query: string, genre: Genre = 'all', bookmarks: string[] = []): Story[] {
  let result = stories;

  // Filter by genre or bookmarks
  if (genre === 'bookmarked') {
    result = stories.filter(s => bookmarks.includes(s.id));
  } else if (genre !== 'all') {
    result = stories.filter(s => s.genre === genre);
  }

  // Filter by search query if provided
  if (query.trim()) {
    const searchResults = fuse.search(query.trim());
    const matchedIds = new Set(searchResults.map(r => r.item.id));
    return result.filter(s => matchedIds.has(s.id));
  }

  return result;
}

export function getStoryById(id: string): Story | undefined {
  return stories.find(s => s.id === id);
}

/**
 * Always returns the latest released story (index 0) from the playlist
 */
export function getTonightsPick(): Story {
  return stories[0];
}

export function getLatestStory(): Story {
  return stories[0];
}

export const GENRES_CONFIG: { id: Genre; labelBn: string; labelEn: string; color: string; bgImage: string }[] = [
  { id: 'all', labelBn: 'সব গল্প', labelEn: 'All Stories', color: '#f59e0b', bgImage: '/hero/all.png' },
  { id: 'thriller', labelBn: 'রোমাঞ্চকর', labelEn: 'Thriller', color: '#f59e0b', bgImage: '/hero/all.png' },
  { id: 'horror', labelBn: 'ভৌতিক', labelEn: 'Horror', color: '#10b981', bgImage: '/hero/all.png' },
  { id: 'mystery', labelBn: 'গোয়েন্দা', labelEn: 'Mystery', color: '#ef4444', bgImage: '/hero/all.png' },
  { id: 'novel', labelBn: 'কালজয়ী সাহিত্য', labelEn: 'Classics', color: '#d97706', bgImage: '/hero/all.png' },
  { id: 'adventure', labelBn: 'অভিযান', labelEn: 'Adventure', color: '#06b6d4', bgImage: '/hero/all.png' },
  { id: 'bookmarked', labelBn: 'পছন্দের গল্প', labelEn: 'Saved', color: '#eab308', bgImage: '/hero/all.png' },
];
