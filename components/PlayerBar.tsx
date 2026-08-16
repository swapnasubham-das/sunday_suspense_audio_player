'use client';

import React, { useState, useRef } from 'react';
import { Story } from '@/lib/types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Share2,
  Moon,
  Bookmark,
} from 'lucide-react';
import StoryImage from './StoryImage';

interface PlayerBarProps {
  currentStory: Story | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeatMode: 'off' | 'queue' | 'single';
  isShuffle: boolean;
  isBookmarked: boolean;
  sleepTimerMinutes: number | null;
  totalStoriesCount: number;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: (deltaSeconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleBookmark: () => void;
  onOpenDrawer: () => void;
  onOpenShare: () => void;
  onOpenSleepTimer: () => void;
  onOpenSoundscape?: () => void;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerBar({
  currentStory,
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  repeatMode,
  isShuffle,
  isBookmarked,
  sleepTimerMinutes,
  totalStoriesCount,
  onTogglePlay,
  onSeek,
  onNext,
  onPrevious,
  onSkip,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
  onToggleRepeat,
  onToggleShuffle,
  onToggleBookmark,
  onOpenDrawer,
  onOpenShare,
  onOpenSleepTimer,
}: PlayerBarProps) {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const effectiveDuration = duration || (currentStory?.durationSec || 1);
  const progressPercent = Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100));

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !effectiveDuration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percent * effectiveDuration);
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !effectiveDuration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, mouseX / rect.width));
    setHoverTime(percent * effectiveDuration);
    setHoverX(mouseX);
  };

  const handleProgressBarMouseLeave = () => {
    setHoverTime(null);
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5];
  const nextSpeed = () => {
    const currentIndex = speedOptions.indexOf(playbackRate);
    const nextIdx = (currentIndex + 1) % speedOptions.length;
    onPlaybackRateChange(speedOptions[nextIdx]);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 select-none pointer-events-auto safe-bottom">
      {/* Full-Width Flat Spotify-Style Dock */}
      <div className="w-full bg-black border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-2 sm:px-5 py-1.5 sm:py-2.5 transition-all duration-300">
        <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto">

        {/* Top: Full-Width Scrubber Track */}
        <div className="w-full relative px-1 pt-0.5 sm:pt-1 pb-0.5">
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            onMouseMove={handleProgressBarMouseMove}
            onMouseLeave={handleProgressBarMouseLeave}
            className="relative h-2 sm:h-1.5 w-full rounded-full bg-white/[0.07] cursor-pointer group py-2 sm:py-1.5 -my-1.5 touch-manipulation"
          >
            {/* Background Track */}
            <div className="relative h-1.5 sm:h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-accent transition-all duration-100 shadow-[0_0_10px_var(--genre-glow)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Scrubber Knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.5)] ring-2 ring-[color:var(--genre-accent)] opacity-100 scale-90 sm:scale-75 sm:group-hover:scale-100 transition-transform"
              style={{ left: `${progressPercent}%` }}
            />

            {/* Hover Tooltip */}
            {hoverTime !== null && (
              <div
                className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 text-amber-300 font-mono text-[10px] border border-amber-500/30 shadow-lg pointer-events-none"
                style={{ left: `${hoverX}px` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Time Indicators directly below the scrubber */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-gray-400 mt-0.5 sm:mt-1 px-0.5">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                onClick={nextSpeed}
                className="px-1.5 py-0.2 rounded bg-white/5 text-amber-300/90 font-mono text-[9px] font-bold border border-white/10"
              >
                {playbackRate}x
              </button>
            </div>
            <span>{formatTime(effectiveDuration)}</span>
          </div>
        </div>

        {/* ================= MOBILE LAYOUT (< sm) ================= */}
        <div className="flex sm:hidden items-center justify-between gap-1 xs:gap-2 mt-1 w-full overflow-hidden">
          {/* Mobile Track Info */}
          <div
            onClick={onOpenDrawer}
            className="flex-1 min-w-0 flex items-center gap-1.5 xs:gap-2 cursor-pointer group overflow-hidden pr-0.5"
          >
            <div className="relative w-8 h-8 xs:w-10 xs:h-10 rounded-lg xs:rounded-xl overflow-hidden flex-shrink-0 border border-amber-500/30 shadow-md bg-black/50">
              <StoryImage
                key={currentStory.id}
                src={currentStory.thumbnail}
                alt={currentStory.title}
                genre={currentStory.genre}
                className="object-cover"
                sizes="40px"
              />
              {isPlaying && (
                <div className="absolute inset-x-0 bottom-0.5 flex items-end justify-center gap-0.5 h-2">
                  <div className="w-0.5 h-1.5 bg-amber-400 rounded-full eq-bar-1" />
                  <div className="w-0.5 h-2 bg-amber-400 rounded-full eq-bar-2" />
                  <div className="w-0.5 h-1 bg-amber-400 rounded-full eq-bar-3" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bengali font-bold text-[11px] xs:text-xs text-white truncate group-hover:text-amber-300">
                {currentStory.title}
              </h3>
              <p className="text-[9px] xs:text-[10px] font-bengali text-gray-400 truncate mt-0.5">
                {currentStory.author}
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-0.5 xs:gap-1 flex-shrink-0">
            <button
              onClick={onToggleBookmark}
              title={isBookmarked ? 'Remove from Saved' : 'Save Story'}
              className={`p-1 xs:p-1.5 rounded-lg transition-all ${
                isBookmarked
                  ? 'text-amber-400 bg-amber-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 xs:w-4 xs:h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={onPrevious}
              title="Previous Track"
              className="p-1 xs:p-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            </button>

            {/* Glowing Golden Play/Pause Circle */}
            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-gradient-accent active:brightness-110 text-white flex items-center justify-center shadow-[0_0_16px_rgba(220,38,38,0.5)] active:scale-95 transition-all mx-0.5 flex-shrink-0"
            >
              {isBuffering ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 xs:w-4.5 xs:h-4.5 fill-white" />
              ) : (
                <Play className="w-4 h-4 xs:w-4.5 xs:h-4.5 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              title="Next Track"
              className="p-1 xs:p-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
            </button>

            <button
              onClick={onOpenDrawer}
              title="গল্প তালিকা"
              className="p-1 xs:p-1.5 rounded-lg bg-white/5 text-amber-300 border border-white/10 flex items-center justify-center active:scale-95"
            >
              <ListMusic className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* ================= TABLET & DESKTOP LAYOUT (>= sm) ================= */}
        <div className="hidden sm:flex items-center justify-between gap-2 sm:gap-4 mt-1 w-full">
          
          {/* ================= LEFT: FIXED WIDTH TRACK INFO ================= */}
          <div className="w-[200px] md:w-[260px] lg:w-[290px] flex-shrink-0 flex items-center gap-3 overflow-hidden">
            {/* Artwork Thumbnail */}
            <div
              onClick={onOpenDrawer}
              title="Open Library"
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex-shrink-0 border border-amber-500/30 shadow-md cursor-pointer group bg-black/50"
            >
              <StoryImage
                key={currentStory.id}
                src={currentStory.thumbnail}
                alt={currentStory.title}
                genre={currentStory.genre}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="55px"
              />

              {/* Animated Equalizer Wave when playing */}
              {isPlaying && (
                <div className="absolute inset-x-0 bottom-1 flex items-end justify-center gap-0.5 h-3">
                  <div className="w-0.5 h-2.5 bg-amber-400 rounded-full eq-bar-1" />
                  <div className="w-0.5 h-3 bg-amber-400 rounded-full eq-bar-2" />
                  <div className="w-0.5 h-2 bg-amber-400 rounded-full eq-bar-3" />
                </div>
              )}
            </div>

            {/* Title & Author with strict single-line overflow truncation */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <span className="text-[9px] font-bengali text-amber-300 font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 inline-block mb-0.5">
                {currentStory.genreBn}
              </span>
              <h3 className="font-bengali font-bold text-xs sm:text-sm text-white truncate block w-full hover:text-amber-300 transition-colors">
                {currentStory.title}
              </h3>
              <p className="text-[11px] font-bengali text-gray-400 truncate block w-full mt-0.5">
                {currentStory.author}
              </p>
            </div>

            {/* Bookmark Star */}
            <button
              onClick={onToggleBookmark}
              title={isBookmarked ? 'Remove from Saved' : 'Save Story'}
              className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                isBookmarked
                  ? 'text-amber-400 bg-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* ================= CENTER: PERFECTLY CENTERED TRANSPORT CONTROLS ================= */}
          <div className="flex-1 min-w-0 flex items-center justify-center gap-2 sm:gap-3.5 mx-auto">
            {/* Shuffle */}
            <button
              onClick={onToggleShuffle}
              title={isShuffle ? 'Shuffle Active' : 'Shuffle Off'}
              className={`p-1.5 rounded-lg transition-all ${
                isShuffle
                  ? 'text-amber-400 bg-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Seek -10s */}
            <button
              onClick={() => onSkip(-10)}
              title="Seek -10s"
              className="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors p-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[8px] font-mono leading-none mt-0.5 text-gray-400">10</span>
            </button>

            {/* Previous */}
            <button
              onClick={onPrevious}
              title="Previous Track"
              className="p-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Glowing Golden Play/Pause Circle */}
            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-accent hover:brightness-110 text-white flex items-center justify-center shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all mx-1 flex-shrink-0"
            >
              {isBuffering ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white" />
              ) : (
                <Play className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-white ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              title="Next Track"
              className="p-1.5 text-gray-300 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Seek +10s */}
            <button
              onClick={() => onSkip(10)}
              title="Seek +10s"
              className="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors p-1"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[8px] font-mono leading-none mt-0.5 text-gray-400">10</span>
            </button>

            {/* Repeat Mode */}
            <button
              onClick={onToggleRepeat}
              title={`Repeat: ${repeatMode}`}
              className={`p-1.5 rounded-lg transition-all ${
                repeatMode !== 'off'
                  ? 'text-amber-400 bg-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {repeatMode === 'single' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* ================= RIGHT: FIXED WIDTH TOOLS & "গল্প তালিকা" BUTTON ================= */}
          <div className="w-[200px] md:w-[260px] lg:w-[290px] flex-shrink-0 flex items-center justify-end gap-2 sm:gap-3">
            {/* Speed Pill */}
            <button
              onClick={nextSpeed}
              title="Playback Speed"
              className="hidden sm:inline-flex px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-amber-200/90 border border-white/10 transition-all active:scale-95 flex-shrink-0"
            >
              {playbackRate}x
            </button>

            {/* Volume Control with Slider */}
            <div className="hidden md:flex items-center gap-1.5 group flex-shrink-0">
              <button
                onClick={onToggleMute}
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 text-gray-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-gray-300" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={e => onVolumeChange(parseFloat(e.target.value))}
                className="w-14 lg:w-18 h-1.5 accent-amber-400 cursor-pointer bg-white/10 rounded-full"
              />
            </div>

            {/* Sleep Timer */}
            <button
              onClick={onOpenSleepTimer}
              title="Sleep Timer"
              className={`hidden sm:flex p-1.5 rounded-lg transition-all flex-shrink-0 ${
                sleepTimerMinutes
                  ? 'text-amber-400 bg-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={onOpenShare}
              title="Share Story"
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* গল্প তালিকা Button */}
            <button
              onClick={onOpenDrawer}
              title="গল্প তালিকা"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 text-xs font-semibold shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              <ListMusic className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bengali">গল্প তালিকা</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                {totalStoriesCount}
              </span>
            </button>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}
