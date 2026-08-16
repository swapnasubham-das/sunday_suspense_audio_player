'use client';

import React, { useEffect, useState } from 'react';
import { GENRES_CONFIG } from '@/lib/content';
import { Genre } from '@/lib/types';

interface HeroBackgroundProps {
  genre: Genre;
  isPlaying: boolean;
}

export default function HeroBackground({ genre, isPlaying }: HeroBackgroundProps) {
  const activeConfig = GENRES_CONFIG.find(g => g.id === genre) || GENRES_CONFIG[0];
  const [currentImg, setCurrentImg] = useState<string>(activeConfig.bgImage);
  const [prevImg, setPrevImg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    if (activeConfig.bgImage !== currentImg) {
      setPrevImg(currentImg);
      setCurrentImg(activeConfig.bgImage);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevImg(null);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [activeConfig.bgImage, currentImg]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
      {/* Base Dark Ground */}
      <div className="absolute inset-0 bg-[#0a0a0e]" />

      {/* Previous image for seamless crossfade */}
      {prevImg && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url(${prevImg})` }}
        />
      )}

      {/* Current background image with 100% full clarity and visibility */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform ${
          isPlaying ? 'scale-[1.02]' : 'scale-100'
        } opacity-100`}
        style={{
          backgroundImage: `url(${currentImg})`,
          transitionProperty: 'transform, opacity',
          transitionDuration: '10s, 0.7s',
        }}
      />

      {/* Retro Paper Grain Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Minimal Edge Vignette to keep text readable while keeping 90%+ background unobstructed */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/80 via-transparent to-[#070709]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(7,7,9,0.35)_100%)]" />

      {/* Dynamic subtle ambient genre bloom */}
      <div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-64 rounded-full blur-[140px] opacity-15 transition-colors duration-1000"
        style={{ backgroundColor: activeConfig.color }}
      />
    </div>
  );
}
