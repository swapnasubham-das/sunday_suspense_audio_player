'use client';

import React from 'react';
import { Story } from '@/lib/types';
import { Sparkles, Play, Pause, Clock, User, Bookmark, Radio, Calendar, ListMusic, ChevronRight, Share2 } from 'lucide-react';
import StoryImage from './StoryImage';

interface TonightsPickProps {
  story: Story;
  currentPlayingStory: Story | null;
  isPlaying: boolean;
  isBookmarked: boolean;
  isFeatured?: boolean;
  onPlay: (story: Story) => void;
  onToggleBookmark: (storyId: string) => void;
  onOpenDrawer: () => void;
  onOpenShare?: () => void;
}

/**
 * "Now Playing" spotlight hero — shows whichever story is currently active
 * (falling back to the latest release when nothing has been picked yet).
 */
export default function TonightsPick({
  story,
  currentPlayingStory,
  isPlaying,
  isBookmarked,
  isFeatured = false,
  onPlay,
  onToggleBookmark,
  onOpenDrawer,
  onOpenShare,
}: TonightsPickProps) {
  const isThisPlaying = currentPlayingStory?.id === story.id && isPlaying;
  const isSelected = currentPlayingStory?.id === story.id;

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 select-none animate-in fade-in zoom-in-95 duration-500">
      {/* Spotlight Card */}
      <div className="relative glass-card rounded-[28px] p-4 xs:p-5 sm:p-7 overflow-hidden">
        {/* Ambient genre-colored glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: 'var(--genre-accent)' }}
        />

        <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">

          {/* Left: HD Thumbnail with Glowing Play Overlay */}
          <div
            onClick={() => onPlay(story)}
            className="relative w-full sm:w-36 md:w-40 aspect-video sm:aspect-square rounded-2xl overflow-hidden flex-shrink-0 border border-white/15 shadow-xl cursor-pointer group/art bg-black/50 ring-accent-glow"
          >
            <StoryImage
              src={story.thumbnail}
              alt={story.title}
              genre={story.genre}
              className="object-cover group-hover/art:scale-105 transition-transform duration-500"
              sizes="220px"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/35 group-hover/art:bg-black/15 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-accent text-white flex items-center justify-center shadow-xl transform transition-transform group-hover/art:scale-110 active:scale-95">
                {isThisPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-1" />
                )}
              </div>
            </div>

            {/* Live Playing Tag */}
            {isThisPlaying && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-sans font-bold flex items-center gap-1 shadow animate-pulse">
                <Radio className="w-3 h-3" />
                <span>LIVE</span>
              </div>
            )}

            {/* Equalizer indicator when playing */}
            {isThisPlaying && (
              <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-3.5">
                <div className="w-0.5 bg-amber-300 rounded-t eq-bar-1" />
                <div className="w-0.5 bg-amber-300 rounded-t eq-bar-2" />
                <div className="w-0.5 bg-amber-300 rounded-t eq-bar-3" />
              </div>
            )}
          </div>

          {/* Right: Story Details & Metadata */}
          <div className="flex-1 min-w-0 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-bengali text-amber-300 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                {isThisPlaying
                  ? 'এখন চলছে (Now Playing)'
                  : isSelected
                  ? 'নির্বাচিত গল্প (Selected)'
                  : isFeatured
                  ? 'আজকের নির্বাচন (Featured Story)'
                  : 'সর্বশেষ নির্বাচিত গল্প'}
              </span>
              <span className="text-[11px] sm:text-xs font-bengali text-gray-300 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                {story.genreBn}
              </span>
            </div>

            <h2 className="font-bengali font-bold text-lg sm:text-2xl lg:text-3xl text-white line-clamp-2 hover:text-amber-300 transition-colors">
              {story.title}
            </h2>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2 text-xs text-gray-300 font-sans">
              <span className="flex items-center gap-1 font-bengali text-gray-200">
                <User className="w-3.5 h-3.5 text-amber-400" />
                {story.author}
              </span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-1 font-mono text-gray-200">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {story.durationFormatted}
              </span>
              {story.publishedFormatted && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="flex items-center gap-1 text-amber-300 font-sans text-xs">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {story.publishedFormatted}
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-4">
              <button
                onClick={() => onPlay(story)}
                className="px-5 py-2.5 rounded-xl bg-gradient-accent hover:brightness-110 text-white text-xs sm:text-sm font-bengali font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                {isThisPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>বিরতি দিন</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                    <span>এখন শুনুন (Play Now)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleBookmark(story.id)}
                title={isBookmarked ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় রাখুন'}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/10 border-white/15 text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>

              {onOpenShare && (
                <button
                  onClick={onOpenShare}
                  title="শেয়ার করুন"
                  className="p-2.5 rounded-xl border bg-white/10 border-white/15 text-gray-300 hover:text-white hover:bg-white/20 transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenDrawer}
                className="px-4 py-2.5 rounded-xl glass-pill text-xs text-gray-200 hover:text-white font-bengali font-semibold flex items-center gap-1.5 transition-all"
              >
                <ListMusic className="w-4 h-4 text-amber-400" />
                <span>সব গল্প দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
