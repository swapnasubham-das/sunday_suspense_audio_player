'use client';

import React, { useEffect, useRef } from 'react';
import { Story } from '@/lib/types';

interface YouTubePlayerProps {
  currentStory: Story | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  seekToTime: number | null;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onStateChange: (isPlaying: boolean) => void;
  onBuffering: (isBuffering: boolean) => void;
  onEnded: () => void;
  onPlayerReady?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({
  currentStory,
  isPlaying,
  volume,
  isMuted,
  playbackRate,
  seekToTime,
  onTimeUpdate,
  onStateChange,
  onBuffering,
  onEnded,
  onPlayerReady,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const isReadyRef = useRef<boolean>(false);
  const currentVideoIdRef = useRef<string | null>(null);

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      try {
        playerRef.current = new window.YT.Player('yt-audio-player-frame', {
          height: '180',
          width: '240',
          videoId: currentStory?.id || 'ccDJabFxKTc',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              isReadyRef.current = true;
              currentVideoIdRef.current = currentStory?.id || null;
              event.target.setVolume(isMuted ? 0 : Math.round(volume * 100));
              event.target.setPlaybackRate(playbackRate);
              if (onPlayerReady) onPlayerReady();
            },
            onStateChange: (event: any) => {
              if (!window.YT) return;
              const state = event.data;

              if (state === window.YT.PlayerState.PLAYING) {
                onBuffering(false);
                onStateChange(true);
              } else if (state === window.YT.PlayerState.PAUSED) {
                onBuffering(false);
                onStateChange(false);
              } else if (state === window.YT.PlayerState.BUFFERING) {
                onBuffering(true);
              } else if (state === window.YT.PlayerState.ENDED) {
                onBuffering(false);
                onStateChange(false);
                onEnded();
              }
            },
            onError: (e: any) => {
              console.warn('YouTube Player Event:', e.data);
              onBuffering(false);
            },
          },
        });
      } catch (err) {
        console.error('Error creating YouTube player:', err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
    };
  }, []);

  // Sync Video ID when currentStory changes
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current || !currentStory) return;
    if (currentVideoIdRef.current === currentStory.id) return;

    currentVideoIdRef.current = currentStory.id;

    try {
      if (isPlaying) {
        playerRef.current.loadVideoById({
          videoId: currentStory.id,
          startSeconds: 0,
        });
      } else {
        playerRef.current.cueVideoById({
          videoId: currentStory.id,
          startSeconds: 0,
        });
      }
    } catch (e) {
      console.error('Error switching video:', e);
    }
  }, [currentStory?.id, isPlaying]);

  // Sync Play / Pause
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      if (isPlaying) {
        const state = playerRef.current.getPlayerState();
        if (state !== 1) {
          playerRef.current.playVideo();
        }
      } else {
        const state = playerRef.current.getPlayerState();
        if (state === 1) {
          playerRef.current.pauseVideo();
        }
      }
    } catch (e) {}
  }, [isPlaying]);

  // Sync Volume / Mute
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(Math.round(volume * 100));
      }
    } catch (e) {}
  }, [volume, isMuted]);

  // Sync Playback Rate
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      playerRef.current.setPlaybackRate(playbackRate);
    } catch (e) {}
  }, [playbackRate]);

  // Handle Seek requests
  useEffect(() => {
    if (seekToTime === null || !playerRef.current || !isReadyRef.current) return;
    try {
      playerRef.current.seekTo(seekToTime, true);
    } catch (e) {}
  }, [seekToTime]);

  // Polling time updates when playing
  useEffect(() => {
    if (isPlaying) {
      timeUpdateInterval.current = setInterval(() => {
        if (!playerRef.current || !isReadyRef.current) return;
        try {
          const curr = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || (currentStory?.durationSec || 0);
          onTimeUpdate(curr, dur);
        } catch (e) {}
      }, 400);
    } else {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    }

    return () => {
      if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
    };
  }, [isPlaying, currentStory]);

  return (
    <div
      className="fixed bottom-0 right-0 pointer-events-none opacity-[0.01] -z-50 overflow-hidden"
      style={{ width: '120px', height: '90px' }}
      aria-hidden="true"
    >
      <div id="yt-audio-player-frame" />
    </div>
  );
}
