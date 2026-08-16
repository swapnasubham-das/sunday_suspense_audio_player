'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'প্লে / পজ (Play / Pause)' },
    { key: '← / →', desc: '১০ সেকেন্ড আগে / পেছনে (Seek ±10s)' },
    { key: '↑ / ↓', desc: 'ভলিউম বাড়ানো / কমানো (Volume ±5%)' },
    { key: 'M', desc: 'মিউট / আনমিউট (Mute Toggle)' },
    { key: 'N / P', desc: 'পরবর্তী / পূর্ববর্তী গল্প (Next / Prev)' },
    { key: 'E', desc: 'গল্পের তালিকা খুলুন (Episode Drawer)' },
    { key: 'S', desc: 'ঘুমের টাইমার (Sleep Timer)' },
    { key: 'A', desc: 'পার্শ্ব আবহ সঙ্গীত (Ambient Soundscape)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md select-none safe-bottom">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl glass-panel bg-[#0c0d12]/98 border border-white/15 p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-lg text-white">
                কীবোর্ড শর্টকাট (Shortcuts)
              </h3>
              <p className="text-xs text-gray-400">সহজেই কীবোর্ড দিয়ে প্লেয়ার নিয়ন্ত্রণ করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcut Rows */}
        <div className="space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5"
            >
              <span className="text-xs font-bengali text-gray-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 font-mono text-xs font-semibold text-amber-300 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
