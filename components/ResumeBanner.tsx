'use client';

import React from 'react';
import { Story, PlaybackPosition } from '@/lib/types';
import { History, Play, RotateCcw, X } from 'lucide-react';

interface ResumeBannerProps {
  story: Story | null;
  savedPosition: PlaybackPosition | null;
  onResume: (seconds: number) => void;
  onRestart: () => void;
  onDismiss: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ResumeBanner({
  story,
  savedPosition,
  onResume,
  onRestart,
  onDismiss,
}: ResumeBannerProps) {
  if (!story || !savedPosition || savedPosition.positionSec <= 15) return null;

  return (
    <div className="fixed top-[88px] sm:top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-3 sm:px-4 select-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="glass-panel bg-[#0d0e14]/98 rounded-2xl p-2.5 sm:p-3.5 border border-amber-500/40 shadow-2xl shadow-amber-500/15 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-bengali text-white truncate">
              আগের স্থান: <span className="font-mono text-amber-300 font-bold">{formatTime(savedPosition.positionSec)}</span>
            </p>
            <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">
              সেখান থেকে শুরু করবেন নাকি নতুন করে?
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 flex-shrink-0">
          <button
            onClick={() => onResume(savedPosition.positionSec)}
            className="flex-1 xs:flex-initial px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[11px] sm:text-xs font-bengali font-bold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
          >
            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black ml-0.5" />
            চালিয়ে যান
          </button>
          <button
            onClick={onRestart}
            title="শুরু থেকে চালান"
            className="p-1 sm:p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-bengali flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDismiss}
            className="p-1 sm:p-1.5 text-gray-500 hover:text-white rounded-lg"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
