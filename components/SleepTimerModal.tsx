'use client';

import React from 'react';
import { X, Moon, Clock, Check, BellOff } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMinutes: number | null;
  onSetTimer: (minutes: number | null) => void;
}

export default function SleepTimerModal({
  isOpen,
  onClose,
  activeMinutes,
  onSetTimer,
}: SleepTimerModalProps) {
  if (!isOpen) return null;

  const options = [
    { labelBn: '১৫ মিনিট', labelEn: '15 Minutes', minutes: 15 },
    { labelBn: '৩০ মিনিট', labelEn: '30 Minutes', minutes: 30 },
    { labelBn: '৪৫ মিনিট', labelEn: '45 Minutes', minutes: 45 },
    { labelBn: '৬০ মিনিট (১ ঘণ্টা)', labelEn: '60 Minutes (1 hr)', minutes: 60 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm rounded-3xl glass-panel bg-[#0c0d12]/95 border border-white/15 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-lg text-white">
                ঘুমের টাইমার (Sleep Timer)
              </h3>
              <p className="text-xs text-gray-400">
                নির্দিষ্ট সময় পর অডিও নিজে থেকেই বন্ধ হবে
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {options.map(opt => {
            const isSelected = activeMinutes === opt.minutes;
            return (
              <button
                key={opt.minutes}
                onClick={() => {
                  onSetTimer(opt.minutes);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span className="font-bengali font-medium text-sm">{opt.labelBn}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            );
          })}
        </div>

        {/* Turn off timer if active */}
        {activeMinutes !== null && (
          <button
            onClick={() => {
              onSetTimer(null);
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 font-bengali text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <BellOff className="w-4 h-4" />
            টাইমার বন্ধ করুন
          </button>
        )}
      </div>
    </div>
  );
}
