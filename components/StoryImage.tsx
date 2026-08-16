'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface StoryImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  genre?: string;
}

export default function StoryImage({
  src,
  alt,
  fill = true,
  className = 'object-cover',
  sizes = '200px',
  priority = false,
  genre = 'thriller',
}: StoryImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  // Reset and update whenever the src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Try mqdefault if hqdefault failed
      if (src && src.includes('hqdefault.jpg')) {
        setImgSrc(src.replace('hqdefault.jpg', 'mqdefault.jpg'));
      } else {
        // Fallback to hero image
        setImgSrc('/hero/all.png');
      }
    }
  };

  return (
    <Image
      src={imgSrc || '/hero/all.png'}
      alt={alt || 'Sunday Suspense Story'}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
      unoptimized
    />
  );
}
