'use client';

import React, { useCallback, useRef, useState } from 'react';
import { CheckCircle2, Bookmark, Moon, Share2, Volume2, Info, XCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'bookmark' | 'sleep' | 'share' | 'sound' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  leaving?: boolean;
}

const ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2,
  info: Info,
  bookmark: Bookmark,
  sleep: Moon,
  share: Share2,
  sound: Volume2,
  error: XCircle,
};

const ACCENTS: Record<ToastVariant, string> = {
  success: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  info: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
  bookmark: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
  sleep: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30',
  share: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
  sound: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
  error: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
};

/** Lightweight in-page toast notification manager (no external deps). */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 200);
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 2600) => {
      const id = ++idRef.current;
      setToasts(prev => [...prev.slice(-2), { id, message, variant }]);
      setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  return { toasts, showToast, dismissToast };
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[calc(env(safe-area-inset-top)+64px)] sm:top-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none w-full px-4 sm:w-auto">
      {toasts.map(t => {
        const Icon = ICONS[t.variant];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel border shadow-2xl max-w-sm w-full sm:w-auto ${
              ACCENTS[t.variant]
            } ${t.leaving ? 'animate-toast-out' : 'animate-toast-in'}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-[13px] font-medium text-white truncate">{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              className="ml-1 text-white/40 hover:text-white/80 transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
