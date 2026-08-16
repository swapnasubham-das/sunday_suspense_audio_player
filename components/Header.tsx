'use client';

import React, { useState, useEffect } from 'react';
import { GENRES_CONFIG } from '@/lib/content';
import { Genre, Story } from '@/lib/types';
import {
  Volume2,
  Keyboard,
  Bookmark,
  ListMusic,
  Moon,
  Sparkles,
  Play,
  Pause,
  RadioTower,
} from 'lucide-react';

interface HeaderProps {
  activeGenre: Genre;
  latestStory: Story | null;
  currentStory: Story | null;
  isPlaying: boolean;
  onGenreSelect: (genre: Genre) => void;
  onPlayStory: (story: Story) => void;
  onOpenSoundscape: () => void;
  onOpenShortcuts: () => void;
  onOpenDrawer: () => void;
  onOpenSleepTimer: () => void;
  bookmarksCount: number;
  soundscapeActive: boolean;
  sleepTimerMinutes: number | null;
}

export default function Header({
  activeGenre,
  latestStory,
  currentStory,
  isPlaying,
  onGenreSelect,
  onPlayStory,
  onOpenSoundscape,
  onOpenShortcuts,
  onOpenDrawer,
  onOpenSleepTimer,
  bookmarksCount,
  soundscapeActive,
  sleepTimerMinutes,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [listeners, setListeners] = useState<number>(56);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Active Presence Tracking
  useEffect(() => {
    // Generate or retrieve unique session ID for this browser tab
    let sessionId = '';
    try {
      sessionId = sessionStorage.getItem('ss_presence_session') || '';
      if (!sessionId) {
        sessionId = 'usr_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        sessionStorage.setItem('ss_presence_session', sessionId);
      }
    } catch {
      sessionId = 'usr_' + Math.random().toString(36).substring(2, 10);
    }

    const sendHeartbeat = async () => {
      try {
        const res = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            storyId: currentStory?.id,
            action: 'heartbeat',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.onlineCount === 'number') {
            setListeners(data.onlineCount);
          }
        }
      } catch (err) {
        // Silently fallback to at least 1 listener (current user)
      }
    };

    // Initial heartbeat
    sendHeartbeat();

    // Heartbeat every 15 seconds
    const interval = setInterval(sendHeartbeat, 15000);

    // Cleanup on tab close/unload
    const handleUnload = () => {
      try {
        const payload = JSON.stringify({ sessionId, action: 'leave' });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/presence', payload);
        } else {
          fetch('/api/presence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          });
        }
      } catch {}
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [currentStory?.id]);

  const isLatestPlaying = latestStory && currentStory?.id === latestStory.id && isPlaying;

  return (
    <header className="relative z-20 w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 select-none glass-panel bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      {/* 1. Left: Brand & Tagline */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-lg flex-shrink-0">
          <RadioTower className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bengali font-black text-base sm:text-lg text-white tracking-wide leading-none drop-shadow">
              সানডে সাসপেন্স
            </span>
          </div>
          <p className="font-sans text-[10px] font-semibold text-amber-300/80 tracking-wider uppercase leading-tight mt-0.5">
            By Mirchi Bangla
          </p>
        </div>
      </div>

      {/* 2. Center: Genre Switcher Pills & Latest Release Pill (Single Unified Row) */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-[55vw] sm:max-w-none scrollbar-none py-0.5">
        {/* Genre Switcher Pills */}
        <div className="flex items-center gap-1 p-1 rounded-full glass-panel bg-black/50 border border-white/15 shadow-md flex-shrink-0">
          {GENRES_CONFIG.map(g => {
            const isActive = activeGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  onGenreSelect(g.id);
                  onOpenDrawer();
                }}
                className={`px-3 py-1 rounded-full text-xs font-bengali font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${isActive
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                {g.id === 'bookmarked' && <Bookmark className="w-3 h-3" />}
                <span>{g.labelBn}</span>
                {g.id === 'bookmarked' && bookmarksCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-black/30 text-amber-900 font-mono font-bold">
                    {bookmarksCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Latest Release Quick Spotlight Pill */}
        {latestStory && (
          <button
            onClick={() => onPlayStory(latestStory)}
            className={`hidden xl:flex items-center gap-2 px-3 py-1 rounded-full glass-panel border transition-all duration-300 shadow-md group flex-shrink-0 active:scale-95 ${isLatestPlaying
                ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/20 font-bold'
                : 'bg-black/50 hover:bg-black/70 border-amber-500/40 text-amber-300'
              }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLatestPlaying ? 'text-black' : 'text-amber-400'} animate-spin`} style={{ animationDuration: '6s' }} />
            <span className="text-xs font-bengali font-bold truncate max-w-[180px]">
              সর্বশেষ: {latestStory.title}
            </span>
            <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center ${isLatestPlaying ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'}`}>
              {isLatestPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
            </div>
          </button>
        )}
      </div>

      {/* 3. Right: Live Clock, Listeners & Ambient Tools */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Time & Date Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel bg-black/40 border border-white/10 text-xs text-white font-mono shadow-md">
          <span className="font-bold tracking-wider">{timeStr || '8:00 PM'}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300 text-[11px] font-sans">{dateStr}</span>
        </div>

        {/* Live Online Listeners */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel bg-black/40 border border-white/10 text-xs text-gray-300 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono font-bold text-white text-xs">{listeners}</span>
          <span className="text-[11px] text-gray-400">online</span>
        </div>

        {/* Ambient Soundscape Button */}
        <button
          onClick={onOpenSoundscape}
          title="Ambient Soundscape (Rain, Crickets, Vinyl, Wind)"
          className={`p-2 rounded-full glass-panel border transition-all ${soundscapeActive
              ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-black/40 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
            }`}
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Sleep Timer Button */}
        <button
          onClick={onOpenSleepTimer}
          title="Sleep Timer"
          className={`p-2 rounded-full glass-panel border transition-all ${sleepTimerMinutes
              ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-black/40 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
            }`}
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Full Library Drawer Button */}
        <button
          onClick={onOpenDrawer}
          title="Open Complete Library (712 Stories)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-bengali">লাইব্রেরি</span>
          <span className="font-mono text-[11px]">712</span>
        </button>

        {/* Keyboard Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts"
          className="hidden md:flex p-2 rounded-full glass-panel bg-black/40 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
