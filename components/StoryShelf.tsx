'use client';

import React from 'react';
import { Story, PlaybackPosition } from '@/lib/types';
import { Play, Pause, User, Bookmark, ChevronRight, LucideIcon } from 'lucide-react';
import StoryImage from './StoryImage';

interface StoryShelfProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  stories: Story[];
  currentStory: Story | null;
  isPlaying: boolean;
  bookmarks: string[];
  playbackPositions?: Record<string, PlaybackPosition>;
  onPlayStory: (story: Story) => void;
  onToggleBookmark: (storyId: string) => void;
  onOpenAllInDrawer?: () => void;
}

/**
 * A modern, always-visible, horizontally scrolling discovery row
 * (used for "Continue Listening", genre discovery rails, etc.)
 */
export default function StoryShelf({
  title,
  subtitle,
  icon: Icon,
  stories,
  currentStory,
  isPlaying,
  bookmarks,
  playbackPositions = {},
  onPlayStory,
  onToggleBookmark,
  onOpenAllInDrawer,
}: StoryShelfProps) {
  if (stories.length === 0) return null;

  return (
    <div className="w-full max-w-6xl 2xl:max-w-[1500px] mx-auto px-3 xs:px-4 sm:px-6 select-none">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bengali font-bold text-sm sm:text-base text-white truncate">{title}</h3>
            {subtitle && <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{subtitle}</p>}
          </div>
        </div>

        {onOpenAllInDrawer && (
          <button
            onClick={onOpenAllInDrawer}
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bengali text-amber-400 hover:text-amber-300 font-semibold transition-colors group flex-shrink-0"
          >
            <span className="hidden xs:inline">সব দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Rail */}
      <div className="flex items-stretch gap-2.5 sm:gap-3 overflow-x-auto pb-3 pt-0.5 scrollbar-none snap-x shelf-fade-x">
        {stories.map(story => {
          const isSelected = currentStory?.id === story.id;
          const isBookmarked = bookmarks.includes(story.id);
          const posData = playbackPositions[story.id];
          const progressPct =
            posData && posData.durationSec > 0
              ? Math.min(100, Math.round((posData.positionSec / posData.durationSec) * 100))
              : 0;

          return (
            <div
              key={story.id}
              onClick={() => onPlayStory(story)}
              className={`snap-start flex-shrink-0 w-[112px] xs:w-32 sm:w-36 rounded-2xl glass-card p-2 sm:p-2.5 cursor-pointer group flex flex-col justify-between relative ${
                isSelected ? 'border-amber-400/60 ring-accent-glow' : ''
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2 bg-black/40 border border-white/10">
                <StoryImage
                  src={story.thumbnail}
                  alt={story.title}
                  genre={story.genre}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="150px"
                />

                {/* Play Button Overlay */}
                <div
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-accent text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                    {isSelected && isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 font-mono text-[9px] text-gray-300">
                  {story.durationFormatted}
                </div>

                {/* Continue-listening progress bar */}
                {progressPct > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                    <div className="h-full bg-gradient-accent" style={{ width: `${progressPct}%` }} />
                  </div>
                )}

                {/* Bookmark Toggle */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleBookmark(story.id);
                  }}
                  className={`absolute top-1 right-1 p-1 rounded transition-all ${
                    isBookmarked ? 'text-amber-400 bg-black/70' : 'text-gray-400 bg-black/50 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              {/* Title & Author */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-bengali font-bold text-xs truncate transition-colors ${
                    isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-200'
                  }`}
                >
                  {story.title}
                </h4>
                <p className="text-[10px] font-bengali text-gray-400 truncate mt-0.5 flex items-center gap-1">
                  <User className="w-2.5 h-2.5 text-gray-500 flex-shrink-0" />
                  {story.author}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
