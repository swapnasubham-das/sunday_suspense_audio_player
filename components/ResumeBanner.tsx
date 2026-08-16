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
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 select-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="glass-panel bg-[#0d0e14]/95 rounded-2xl p-3.5 border border-amber-500/30 shadow-2xl shadow-amber-500/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bengali text-white truncate">
              আগের বার যেখানে থেমেছিলেন: <span className="font-mono text-amber-300 font-bold">{formatTime(savedPosition.positionSec)}</span>
            </p>
            <p className="text-[10px] text-gray-400 truncate">
              সেখান থেকে শুরু করবেন নাকি শুরু থেকে?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onResume(savedPosition.positionSec)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bengali font-bold flex items-center gap-1 transition-all shadow-sm"
          >
            <Play className="w-3 h-3 fill-black ml-0.5" />
            চালিয়ে যান
          </button>
          <button
            onClick={onRestart}
            title="শুরু থেকে চালান"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-bengali flex items-center gap-1 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDismiss}
            className="p-1.5 text-gray-500 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
