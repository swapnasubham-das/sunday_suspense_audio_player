'use client';

import React, { useState } from 'react';
import { Story } from '@/lib/types';
import { X, Share2, Copy, Check, MessageCircle, Twitter } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
  currentTime: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ShareModal({
  isOpen,
  onClose,
  story,
  currentTime,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !story) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareTimestamp = Math.floor(currentTime);
  const shareUrl = `${origin}/?story=${story.id}${shareTimestamp > 5 ? `&t=${shareTimestamp}` : ''}`;

  const shareText = `Sunday Suspense - "${story.title}" (${story.author}) By Mirchi Bangla:`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Listening to "${story.title}" on Sunday Suspense by Mirchi Bangla\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

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
              <Share2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-lg text-white">
                শেয়ার করুন (Share Moment)
              </h3>
              <p className="text-xs text-gray-400">
                নির্দিষ্ট সময়ের লিঙ্ক বন্ধুদের সাথে শেয়ার করুন
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

        {/* Story Snapshot */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bengali px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              {story.genreBn}
            </span>
            {shareTimestamp > 5 && (
              <span className="text-[10px] font-mono text-gray-400">
                মুহূর্তঃ {formatTime(shareTimestamp)}
              </span>
            )}
          </div>
          <h4 className="font-bengali font-bold text-sm text-white mt-1">
            {story.title}
          </h4>
          <p className="text-xs font-bengali text-gray-400 mt-0.5">
            {story.author}
          </p>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={shareWhatsApp}
            className="p-3 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 text-[#25D366] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp-এ পাঠান
          </button>

          <button
            onClick={shareTwitter}
            className="p-3 rounded-2xl bg-[#1DA1F2]/15 border border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/25 text-[#1DA1F2] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            Twitter / X
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/40 border border-white/10">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent px-2 text-xs font-mono text-gray-300 flex-1 outline-none truncate select-all"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-gradient-accent hover:brightness-110 text-white text-xs font-bengali font-bold flex items-center gap-1.5 transition-colors shadow-md flex-shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                কপি হয়েছে
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                কপি লিঙ্ক
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
