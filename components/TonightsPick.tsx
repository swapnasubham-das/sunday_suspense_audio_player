'use client';

import React from 'react';
import { Story } from '@/lib/types';
import { Sparkles, Play, Pause, Clock, User, Bookmark, Radio, Calendar, ListMusic, ChevronRight } from 'lucide-react';
import StoryImage from './StoryImage';

interface TonightsPickProps {
  story: Story;
  currentPlayingStory: Story | null;
  isPlaying: boolean;
  isBookmarked: boolean;
  onPlay: (story: Story) => void;
  onToggleBookmark: (storyId: string) => void;
  onOpenDrawer: () => void;
}

export default function TonightsPick({
  story,
  currentPlayingStory,
  isPlaying,
  isBookmarked,
  onPlay,
  onToggleBookmark,
  onOpenDrawer,
}: TonightsPickProps) {
  const isThisPlaying = currentPlayingStory?.id === story.id && isPlaying;
  const isSelected = currentPlayingStory?.id === story.id;

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 select-none animate-in fade-in zoom-in-95 duration-500">
      {/* Spotlight Card */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/60 hover:border-amber-400/40 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          
          {/* Left: HD Thumbnail with Glowing Play Overlay */}
          <div
            onClick={() => onPlay(story)}
            className="relative w-full sm:w-44 aspect-video sm:aspect-square rounded-2xl overflow-hidden flex-shrink-0 border border-white/20 shadow-xl cursor-pointer group/art bg-black/50"
          >
            <StoryImage
              src={story.thumbnail}
              alt={story.title}
              genre={story.genre}
              className="object-cover group-hover/art:scale-105 transition-transform duration-500"
              sizes="200px"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/35 group-hover/art:bg-black/15 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-xl transform transition-transform group-hover/art:scale-110 active:scale-95">
                {isThisPlaying ? (
                  <Pause className="w-6 h-6 fill-black" />
                ) : (
                  <Play className="w-6 h-6 fill-black ml-1" />
                )}
              </div>
            </div>

            {/* Live Playing Tag */}
            {isThisPlaying && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-sans font-bold flex items-center gap-1 shadow animate-pulse">
                <Radio className="w-3 h-3" />
                <span>LIVE</span>
              </div>
            )}
          </div>

          {/* Right: Story Details & Metadata */}
          <div className="flex-1 min-w-0 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-bengali text-amber-300 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                সর্বশেষ নির্বাচিত গল্প (Latest Release)
              </span>
              <span className="text-xs font-bengali text-gray-300 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                {story.genreBn}
              </span>
            </div>

            <h2 className="font-bengali font-bold text-lg sm:text-2xl text-white truncate hover:text-amber-300 transition-colors">
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
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs sm:text-sm font-bengali font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                {isThisPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-black" />
                    <span>বিরতি দিন</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                    <span>এখন শুনুন (Play Now)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleBookmark(story.id)}
                title={isBookmarked ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় রাখুন'}
                className={`p-2.5 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/10 border-white/15 text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={onOpenDrawer}
                className="px-4 py-2.5 rounded-xl glass-panel bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-gray-200 hover:text-white font-bengali font-semibold flex items-center gap-1.5 transition-all"
              >
                <ListMusic className="w-4 h-4 text-amber-400" />
                <span>সব গল্প দেখুন (712)</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
