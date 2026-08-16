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
      {/* Base Spotify Black Ground */}
      <div className="absolute inset-0 bg-black" />

      {/* Previous image for seamless crossfade */}
      {prevImg && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url(${prevImg})`, opacity: isTransitioning ? 0 : 0.18 }}
        />
      )}

      {/* Current background image kept subtle — Spotify-style color wash, not a dominant photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.18] transition-opacity duration-1000 ease-out"
        style={{ backgroundImage: `url(${currentImg})` }}
      />

      {/* Heavy dark scrim so content always reads clearly on top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,0,0,0.6)_75%)]" />

      {/* Subtle brand-green ambient bloom at the top, like a Spotify "now playing" wash */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 rounded-full blur-[160px] transition-all duration-1000 ${
          isPlaying ? 'opacity-25' : 'opacity-15'
        }`}
        style={{ backgroundColor: activeConfig.color }}
      />
    </div>
  );
}
