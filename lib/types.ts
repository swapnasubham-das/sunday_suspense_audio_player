export type Genre = 'all' | 'thriller' | 'horror' | 'mystery' | 'novel' | 'adventure' | 'bookmarked';

export interface Story {
  id: string;
  title: string;
  titleEn: string;
  rawTitle: string;
  author: string;
  narrator: string;
  genre: 'thriller' | 'horror' | 'mystery' | 'novel' | 'adventure';
  genreBn: string;
  durationSec: number;
  durationFormatted: string;
  uploadDate?: string;
  timestamp?: number;
  publishedFormatted?: string;
  thumbnail: string;
  youtubeUrl: string;
}

export interface PlaybackPosition {
  storyId: string;
  positionSec: number;
  durationSec: number;
  updatedAt: number;
}

export interface SoundscapeState {
  enabled: boolean;
  type: 'rain' | 'crickets' | 'vinyl' | 'wind';
  volume: number; // 0 to 1
}

export interface PlayerState {
  currentStory: Story | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  playbackRate: number;
  isBuffering: boolean;
  repeatMode: 'off' | 'queue' | 'single';
  isShuffle: boolean;
  activeGenre: Genre;
}
