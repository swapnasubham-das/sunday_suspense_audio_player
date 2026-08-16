'use client';

import React, { useState } from 'react';
import { Story, Genre } from '@/lib/types';
import { Play, Pause, Clock, User, Bookmark, ChevronRight, Sparkles, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import StoryImage from './StoryImage';

interface StoryShelfProps {
  genre: Genre;
  stories: Story[];
  currentStory: Story | null;
  isPlaying: boolean;
  bookmarks: string[];
  onPlayStory: (story: Story) => void;
  onToggleBookmark: (storyId: string) => void;
  onOpenAllInDrawer: () => void;
}

export default function StoryShelf({
  genre,
  stories,
  currentStory,
  isPlaying,
  bookmarks,
  onPlayStory,
  onToggleBookmark,
  onOpenAllInDrawer,
}: StoryShelfProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (stories.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 my-2 text-center py-4 glass-panel rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
        <Bookmark className="w-6 h-6 mx-auto text-amber-400/60 mb-1" />
        <p className="font-bengali text-white text-sm font-semibold">
          পছন্দের তালিকায় কোনো গল্প নেই
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 select-none transition-all duration-300">
      {/* Floating Toggle Pill (Lets background artwork stay wide open) */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(p => !p)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel bg-black/40 hover:bg-black/60 border border-white/15 text-xs text-white font-bengali font-semibold transition-all shadow-md group"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>
            {genre === 'all'
              ? 'জনপ্রিয় গল্পসমূহ'
              : genre === 'bookmarked'
              ? 'পছন্দের গল্পসমূহ'
              : `${stories[0]?.genreBn || ''} গল্প`}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
            {stories.length}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        <button
          onClick={onOpenAllInDrawer}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass-panel bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-bengali text-amber-400 hover:text-amber-300 font-semibold transition-colors group shadow-md"
        >
          <span>সম্পূর্ণ লাইব্রেরি ({stories.length})</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Collapsible Horizontal Story Carousel */}
      {isExpanded && (
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x animate-in slide-in-from-bottom-2 duration-300">
          {stories.slice(0, 12).map(story => {
            const isSelected = currentStory?.id === story.id;
            const isBookmarked = bookmarks.includes(story.id);

            return (
              <div
                key={story.id}
                onClick={() => onPlayStory(story)}
                className={`snap-start flex-shrink-0 w-40 sm:w-44 rounded-xl glass-panel p-2.5 border transition-all duration-200 cursor-pointer group flex flex-col justify-between relative bg-black/50 hover:bg-black/70 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2 bg-black/40 border border-white/10">
                  <StoryImage
                    src={story.thumbnail}
                    alt={story.title}
                    genre={story.genre}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="160px"
                  />

                  {/* Play Button Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      {isSelected && isPlaying ? (
                        <Pause className="w-4 h-4 fill-black" />
                      ) : (
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 font-mono text-[9px] text-gray-300">
                    {story.durationFormatted}
                  </div>

                  {/* Bookmark Toggle */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleBookmark(story.id);
                    }}
                    className={`absolute top-1 right-1 p-1 rounded transition-all ${
                      isBookmarked
                        ? 'text-amber-400 bg-black/70'
                        : 'text-gray-400 bg-black/50 hover:text-white'
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
      )}
    </div>
  );
}
