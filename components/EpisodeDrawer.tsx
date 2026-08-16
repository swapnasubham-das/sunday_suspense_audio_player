'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Story, Genre, PlaybackPosition } from '@/lib/types';
import { GENRES_CONFIG } from '@/lib/content';
import {
  Search,
  X,
  Play,
  Pause,
  Clock,
  User,
  Bookmark,
  Sparkles,
  CheckCircle2,
  ListMusic,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import StoryImage from './StoryImage';

interface EpisodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  currentStory: Story | null;
  isPlaying: boolean;
  activeGenre: Genre;
  bookmarks: string[];
  playbackPositions: Record<string, PlaybackPosition>;
  onSelectStory: (story: Story) => void;
  onGenreSelect: (genre: Genre) => void;
  onToggleBookmark: (storyId: string) => void;
}

export default function EpisodeDrawer({
  isOpen,
  onClose,
  stories,
  currentStory,
  isPlaying,
  activeGenre,
  bookmarks,
  playbackPositions,
  onSelectStory,
  onGenreSelect,
  onToggleBookmark,
}: EpisodeDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState<number>(50);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset pagination limit when genre or search query changes
  useEffect(() => {
    setDisplayLimit(50);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeGenre, searchQuery]);

  // Filter stories based on active genre, search query, and bookmarks
  const filteredStories = useMemo(() => {
    let list = stories;

    // Filter by genre or bookmarks
    if (activeGenre === 'bookmarked') {
      list = list.filter(s => bookmarks.includes(s.id));
    } else if (activeGenre !== 'all') {
      list = list.filter(s => s.genre === activeGenre);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.titleEn.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.rawTitle.toLowerCase().includes(q) ||
        s.genreBn.toLowerCase().includes(q)
      );
    }

    return list;
  }, [stories, activeGenre, bookmarks, searchQuery]);

  const visibleStories = useMemo(() => {
    return filteredStories.slice(0, displayLimit);
  }, [filteredStories, displayLimit]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 300) {
      if (displayLimit < filteredStories.length) {
        setDisplayLimit(prev => Math.min(filteredStories.length, prev + 50));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-md transition-all select-none">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto h-[92dvh] sm:h-[84vh] rounded-t-3xl glass-panel bg-[#0b0c10]/98 border-t border-x border-white/15 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drag Handle & Header */}
        <div className="p-3 sm:p-6 pb-2.5 sm:pb-3 border-b border-white/10 flex-shrink-0 bg-black/40">
          <div className="w-10 sm:w-12 h-1 rounded-full bg-white/25 mx-auto mb-2 sm:mb-3" />

          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <ListMusic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bengali font-bold text-base sm:text-xl text-white flex items-center gap-2">
                  গল্প সংগ্রহশালা
                  <span className="px-2 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-mono font-bold border border-amber-500/30">
                    {filteredStories.length} টি
                  </span>
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400 font-sans hidden xs:block">
                  Sunday Suspense Full 700+ Episodes Collection
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Genre Filters */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="গল্পের নাম, লেখক বা চরিত্র দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm font-bengali focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Genre Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {GENRES_CONFIG.map(g => {
                const isActive = activeGenre === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => onGenreSelect(g.id)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bengali font-medium transition-all whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {g.id === 'bookmarked' && <Bookmark className="w-3 h-3" />}
                    <span>{g.labelBn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stories List with Progressive Scroll */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 sm:space-y-2.5 pb-36"
        >
          {filteredStories.length === 0 ? (
            <div className="text-center py-16 text-gray-500 font-bengali space-y-2">
              <Search className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="text-base font-semibold text-gray-400">কোন গল্প পাওয়া যায়নি</p>
              <p className="text-xs">অন্য কোনো শব্দ দিয়ে আবার চেষ্টা করুন</p>
            </div>
          ) : (
            <>
              {visibleStories.map((story, idx) => {
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
                    onClick={() => onSelectStory(story)}
                    className={`group relative rounded-2xl p-2.5 sm:p-3.5 border transition-all duration-200 cursor-pointer flex items-center gap-2.5 sm:gap-4 overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15'
                    }`}
                  >
                    {/* Index / Playing Badge */}
                    <div className="w-5 xs:w-7 text-center text-[10px] xs:text-xs font-mono text-gray-500 group-hover:text-gray-300 flex-shrink-0">
                      {isSelected && isPlaying ? (
                        <div className="flex items-end justify-center gap-0.5 h-3.5">
                          <div className="w-0.5 bg-amber-400 rounded-t eq-bar-1" />
                          <div className="w-0.5 bg-amber-400 rounded-t eq-bar-2" />
                          <div className="w-0.5 bg-amber-400 rounded-t eq-bar-3" />
                        </div>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Thumbnail with Play Icon */}
                    <div className="relative w-14 h-11 xs:w-16 xs:h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-md bg-black/40">
                      <StoryImage
                        src={story.thumbnail}
                        alt={story.title}
                        genre={story.genre}
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="80px"
                      />
                      <div
                        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {isSelected && isPlaying ? (
                          <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                        ) : (
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white ml-0.5" />
                        )}
                      </div>

                      {/* Played Progress Mini-Bar on Thumbnail */}
                      {progressPct > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                          <div
                            className="h-full bg-amber-400"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Story Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap">
                        <span className="text-[9px] xs:text-[10px] font-bengali px-1.5 xs:px-2 py-0.2 sm:py-0.5 rounded-full bg-white/5 border border-white/5 text-amber-300">
                          {story.genreBn}
                        </span>
                        {progressPct >= 90 && (
                          <span className="flex items-center gap-1 text-[9px] xs:text-[10px] text-emerald-400 font-sans">
                            <CheckCircle2 className="w-3 h-3" /> সমাপ্ত
                          </span>
                        )}
                        {progressPct > 0 && progressPct < 90 && (
                          <span className="text-[9px] xs:text-[10px] font-mono text-gray-400">
                            {progressPct}% শোনা হয়েছে
                          </span>
                        )}
                      </div>

                      <h3
                        className={`font-bengali font-bold text-xs xs:text-sm sm:text-base truncate mt-0.5 sm:mt-1 ${
                          isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-200'
                        }`}
                      >
                        {story.title}
                      </h3>

                      <div className="flex items-center gap-2 xs:gap-3 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-400 font-sans flex-wrap">
                        <span className="flex items-center gap-1 truncate font-bengali text-gray-300 max-w-[110px] xs:max-w-[160px] sm:max-w-none">
                          <User className="w-3 h-3 text-amber-400/70 flex-shrink-0" />
                          <span className="truncate">{story.author}</span>
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="flex items-center gap-1 font-mono text-gray-300 flex-shrink-0">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {story.durationFormatted}
                        </span>
                        {story.publishedFormatted && (
                          <>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            <span className="text-[11px] font-sans text-gray-400 hidden sm:inline">
                              {story.publishedFormatted}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bookmark Star Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleBookmark(story.id);
                      }}
                      title={isBookmarked ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় রাখুন'}
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                        isBookmarked
                          ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30'
                          : 'text-gray-500 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                );
              })}

              {/* Load more indicator */}
              {displayLimit < filteredStories.length && (
                <div className="text-center pt-3 pb-6">
                  <button
                    onClick={() => setDisplayLimit(prev => Math.min(filteredStories.length, prev + 50))}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bengali text-xs font-semibold flex items-center gap-2 mx-auto border border-white/10 transition-colors"
                  >
                    <span>আরও দেখুন (Show More)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
