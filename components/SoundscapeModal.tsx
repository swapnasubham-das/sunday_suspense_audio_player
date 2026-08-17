'use client';

import React from 'react';
import { X, CloudRain, Bug, Disc, Wind, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface SoundscapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeType: 'rain' | 'crickets' | 'vinyl' | 'wind';
  isEnabled: boolean;
  volume: number;
  onSelectType: (type: 'rain' | 'crickets' | 'vinyl' | 'wind') => void;
  onToggleEnabled: () => void;
  onVolumeChange: (volume: number) => void;
}

export default function SoundscapeModal({
  isOpen,
  onClose,
  activeType,
  isEnabled,
  volume,
  onSelectType,
  onToggleEnabled,
  onVolumeChange,
}: SoundscapeModalProps) {
  if (!isOpen) return null;

  const presets: { id: 'rain' | 'crickets' | 'vinyl' | 'wind'; titleBn: string; titleEn: string; desc: string; icon: any }[] = [
    {
      id: 'rain',
      titleBn: 'ঝুম বৃষ্টি ও দূরবর্তী মেঘের ডাক',
      titleEn: 'Rain & Distant Thunder',
      desc: 'শান্ত বৃষ্টির শব্দ ও মাঝে মাঝে মৃদু বজ্রধ্বনি',
      icon: CloudRain,
    },
    {
      id: 'crickets',
      titleBn: 'রাতের ঝিঁঝিঁ পোকার ডাক ও কুয়াশা',
      titleEn: 'Night Crickets & Mist',
      desc: 'নিস্তব্ধ গভীর রাতের প্রাকৃতিক পরিবেশ',
      icon: Bug,
    },
    {
      id: 'vinyl',
      titleBn: 'পুরনো রেডিও ও ভিনাইল ক্র্যাকল',
      titleEn: 'Vintage Radio & Vinyl',
      desc: 'নস্টালজিক গ্রামোফোন হিজ ও পুরোনো রেডিওর আবহ',
      icon: Disc,
    },
    {
      id: 'wind',
      titleBn: 'রাতের মৃদু হাওয়া ও বাতাস',
      titleEn: 'Midnight Breeze',
      desc: 'গভীর অরণ্যের মধ্য দিয়ে বয়ে যাওয়া রাতের বাতাস',
      icon: Wind,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md select-none safe-bottom">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl glass-panel bg-[#0c0d12]/98 border border-white/15 p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Mobile Drag Handle */}
        <div className="w-10 sm:hidden h-1 rounded-full bg-white/20 mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-lg text-white">
                পার্শ্ব আবহ সঙ্গীত (Ambient Soundscape)
              </h3>
              <p className="text-xs text-gray-400">
                গল্প শোনার সাথে সাথে ব্যাকগ্রাউন্ডে প্রাকৃতিক আবহ
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

        {/* Master Power Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bengali text-sm font-medium text-white">
              আবহ শব্দ সক্রিয় করুন
            </span>
          </div>
          <button
            onClick={onToggleEnabled}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isEnabled ? 'bg-gradient-accent' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Preset Cards */}
        <div className="space-y-2.5 mb-5">
          {presets.map(preset => {
            const Icon = preset.icon;
            const isSelected = activeType === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectType(preset.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected && isEnabled
                    ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-md'
                    : 'bg-white/[0.03] border-white/5 text-gray-300 hover:bg-white/[0.07] hover:border-white/15'
                }`}
              >
                {/* Hello */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected && isEnabled
                      ? 'bg-gradient-accent text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bengali font-semibold text-sm leading-snug">
                    {preset.titleBn}
                  </h4>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {preset.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Volume Slider */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex justify-between items-center text-xs text-gray-300 font-bengali mb-2">
            <span>আবহ শব্দের তীব্রতা (Volume)</span>
            <span className="font-mono">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={volume}
            onChange={e => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 accent-amber-400 cursor-pointer"
            disabled={!isEnabled}
          />
        </div>
      </div>
    </div>
  );
}
