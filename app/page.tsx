'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { stories, searchStories, getStoryById, getTonightsPick, GENRES_CONFIG } from '@/lib/content';
import { Story, Genre, PlaybackPosition } from '@/lib/types';
import {
  getBookmarks,
  toggleBookmark as toggleBookmarkStorage,
  getAllPlaybackPositions,
  savePlaybackPosition,
  getLastPlayedStoryId,
  setLastPlayedStoryId,
} from '@/lib/resume';
import { ambientSound } from '@/lib/soundscape';

// Components
import HeroBackground from '@/components/HeroBackground';
import Header from '@/components/Header';
import PlayerBar from '@/components/PlayerBar';
import EpisodeDrawer from '@/components/EpisodeDrawer';
import SoundscapeModal from '@/components/SoundscapeModal';
import SleepTimerModal from '@/components/SleepTimerModal';
import ShareModal from '@/components/ShareModal';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import ResumeBanner from '@/components/ResumeBanner';
import YouTubePlayer from '@/components/YouTubePlayer';

export default function Home() {
  // Playback & Story State
  const tonightsPick = useMemo(() => getTonightsPick(), []);
  const [currentStory, setCurrentStory] = useState<Story | null>(tonightsPick);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(tonightsPick?.durationSec || 0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [repeatMode, setRepeatMode] = useState<'off' | 'queue' | 'single'>('queue');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [activeGenre, setActiveGenre] = useState<Genre>('all');
  const [seekToTime, setSeekToTime] = useState<number | null>(null);

  // LocalStorage & Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [playbackPositions, setPlaybackPositions] = useState<Record<string, PlaybackPosition>>({});
  const [resumePrompt, setResumePrompt] = useState<{ story: Story; pos: PlaybackPosition } | null>(null);

  // Soundscape
  const [soundscapeEnabled, setSoundscapeEnabled] = useState<boolean>(false);
  const [soundscapeType, setSoundscapeType] = useState<'rain' | 'crickets' | 'vinyl' | 'wind'>('rain');
  const [soundscapeVolume, setSoundscapeVolume] = useState<number>(0.25);

  // Sleep Timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const sleepTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSoundscapeOpen, setIsSoundscapeOpen] = useState<boolean>(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Initialize from LocalStorage & URL parameters on mount
  useEffect(() => {
    const savedBookmarks = getBookmarks();
    setBookmarks(savedBookmarks);

    const positions = getAllPlaybackPositions();
    setPlaybackPositions(positions);

    // Deep linking URL query parameters
    const params = new URLSearchParams(window.location.search);
    const storyParam = params.get('story');
    const timeParam = params.get('t');

    if (storyParam) {
      const found = getStoryById(storyParam);
      if (found) {
        setCurrentStory(found);
        setActiveGenre(found.genre);
        if (timeParam && !isNaN(parseInt(timeParam))) {
          const seekSec = parseInt(timeParam);
          setTimeout(() => {
            setSeekToTime(seekSec);
            setIsPlaying(true);
          }, 600);
        }
        return;
      }
    }

    // Default to last played story or tonight's pick
    const lastId = getLastPlayedStoryId();
    if (lastId) {
      const lastStory = getStoryById(lastId);
      if (lastStory) {
        setCurrentStory(lastStory);
        const lastPos = positions[lastId];
        if (lastPos && lastPos.positionSec > 20) {
          setResumePrompt({ story: lastStory, pos: lastPos });
        }
      }
    }
  }, []);

  // Update theme data-genre attribute on html
  useEffect(() => {
    const genre = activeGenre !== 'all' && activeGenre !== 'bookmarked'
      ? activeGenre
      : currentStory?.genre || 'thriller';
    document.documentElement.setAttribute('data-genre', genre);
  }, [currentStory, activeGenre]);

  // Throttled position saving
  const lastSavedTime = useRef<number>(0);
  const handleTimeUpdate = useCallback((curr: number, dur: number) => {
    setCurrentTime(curr);
    if (dur > 0) setDuration(dur);

    if (currentStory && Math.abs(curr - lastSavedTime.current) > 4) {
      lastSavedTime.current = curr;
      savePlaybackPosition(currentStory.id, curr, dur || currentStory.durationSec);
    }
  }, [currentStory]);

  // Handle story selection
  const handleSelectStory = useCallback((story: Story) => {
    setCurrentStory(story);
    setIsPlaying(true);
    setSeekToTime(0);
    setLastPlayedStoryId(story.id);

    // Check if resume position exists
    const positions = getAllPlaybackPositions();
    const saved = positions[story.id];
    if (saved && saved.positionSec > 25 && saved.positionSec < (story.durationSec - 30)) {
      setResumePrompt({ story, pos: saved });
    }
  }, []);

  // Handle Resume Prompt
  const handleResume = () => {
    if (resumePrompt) {
      setSeekToTime(resumePrompt.pos.positionSec);
      setIsPlaying(true);
      setResumePrompt(null);
    }
  };

  const handleRestart = () => {
    setSeekToTime(0);
    setIsPlaying(true);
    setResumePrompt(null);
  };

  // Genre filtering & Open Popup Modal List
  const handleGenreSelect = useCallback((genre: Genre) => {
    setActiveGenre(genre);
  }, []);

  // Queue of stories for Next/Previous based on active genre filter
  const currentQueue = useMemo(() => {
    return searchStories('', activeGenre, bookmarks);
  }, [activeGenre, bookmarks]);

  // Track Next & Previous
  const handleNext = useCallback(() => {
    if (!currentStory || currentQueue.length === 0) return;

    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * currentQueue.length);
      handleSelectStory(currentQueue[randomIdx]);
      return;
    }

    const currentIndex = currentQueue.findIndex(s => s.id === currentStory.id);
    if (currentIndex !== -1 && currentIndex < currentQueue.length - 1) {
      handleSelectStory(currentQueue[currentIndex + 1]);
    } else {
      // Loop back to start
      handleSelectStory(currentQueue[0]);
    }
  }, [currentStory, currentQueue, isShuffle, handleSelectStory]);

  const handlePrevious = useCallback(() => {
    if (!currentStory || currentQueue.length === 0) return;
    const currentIndex = currentQueue.findIndex(s => s.id === currentStory.id);
    if (currentIndex > 0) {
      handleSelectStory(currentQueue[currentIndex - 1]);
    } else {
      handleSelectStory(currentQueue[currentQueue.length - 1]);
    }
  }, [currentStory, currentQueue, handleSelectStory]);

  // Handle track ended based on repeat mode
  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'single') {
      setSeekToTime(0);
      setIsPlaying(true);
    } else if (repeatMode === 'queue') {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, handleNext]);

  // Skip ± delta seconds
  const handleSkip = (deltaSeconds: number) => {
    const target = Math.max(0, Math.min(duration || currentStory?.durationSec || 9999, currentTime + deltaSeconds));
    setSeekToTime(target);
  };

  // Bookmarking
  const handleToggleBookmark = (storyId: string) => {
    const updated = toggleBookmarkStorage(storyId);
    setBookmarks(updated);
  };

  // Soundscape toggles
  const handleToggleSoundscape = () => {
    if (soundscapeEnabled) {
      ambientSound.stop();
      setSoundscapeEnabled(false);
    } else {
      ambientSound.start(soundscapeType, soundscapeVolume);
      setSoundscapeEnabled(true);
    }
  };

  const handleSoundscapeTypeChange = (type: 'rain' | 'crickets' | 'vinyl' | 'wind') => {
    setSoundscapeType(type);
    if (soundscapeEnabled) {
      ambientSound.start(type, soundscapeVolume);
    }
  };

  const handleSoundscapeVolumeChange = (vol: number) => {
    setSoundscapeVolume(vol);
    if (soundscapeEnabled) {
      ambientSound.setVolume(vol);
    }
  };

  // Sleep Timer Handler
  const handleSetSleepTimer = (minutes: number | null) => {
    if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }

    setSleepTimerMinutes(minutes);

    if (minutes !== null && minutes > 0) {
      const endTime = Date.now() + minutes * 60 * 1000;
      sleepTimerIntervalRef.current = setInterval(() => {
        const remainingMs = endTime - Date.now();
        if (remainingMs <= 0) {
          setIsPlaying(false);
          if (soundscapeEnabled) {
            ambientSound.stop();
            setSoundscapeEnabled(false);
          }
          setSleepTimerMinutes(null);
          if (sleepTimerIntervalRef.current) {
            clearInterval(sleepTimerIntervalRef.current);
            sleepTimerIntervalRef.current = null;
          }
        }
      }, 1000);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(p => !p);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSeekToTime(t => Math.min(duration || 9999, (t !== null ? t : currentTime) + 15));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSeekToTime(t => Math.max(0, (t !== null ? t : currentTime) - 15));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(v => Math.min(1, parseFloat((v + 0.1).toFixed(2))));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(v => Math.max(0, parseFloat((v - 0.1).toFixed(2))));
          break;
        case 'KeyM':
          setIsMuted(m => !m);
          break;
        case 'KeyN':
          handleNext();
          break;
        case 'KeyP':
          handlePrevious();
          break;
        case 'KeyE':
          setIsDrawerOpen(o => !o);
          break;
        case 'KeyS':
          setIsSleepTimerOpen(o => !o);
          break;
        case 'KeyA':
          setIsSoundscapeOpen(o => !o);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, currentTime, duration]);

  return (
    <main className="relative h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none">
      {/* Full-Bleed 100% Background Artwork */}
      <HeroBackground genre={activeGenre} isPlaying={isPlaying} />

      {/* Invisible YouTube Audio Streaming Engine */}
      <YouTubePlayer
        currentStory={currentStory}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        playbackRate={playbackRate}
        seekToTime={seekToTime}
        onTimeUpdate={handleTimeUpdate}
        onStateChange={setIsPlaying}
        onBuffering={setIsBuffering}
        onEnded={handleTrackEnded}
      />

      {/* Top Floating Header with Sunday Suspense Branding, Tagline, Latest Release, and Genre Tabs */}
      <Header
        activeGenre={activeGenre}
        latestStory={tonightsPick}
        currentStory={currentStory}
        isPlaying={isPlaying}
        onGenreSelect={handleGenreSelect}
        onPlayStory={handleSelectStory}
        onOpenSoundscape={() => setIsSoundscapeOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
        bookmarksCount={bookmarks.length}
        soundscapeActive={soundscapeEnabled}
        sleepTimerMinutes={sleepTimerMinutes}
      />

      {/* Resume Banner Prompt */}
      {resumePrompt && (
        <ResumeBanner
          story={resumePrompt.story}
          savedPosition={resumePrompt.pos}
          onResume={handleResume}
          onRestart={handleRestart}
          onDismiss={() => setResumePrompt(null)}
        />
      )}

      {/* Center Stage: Cinematic Open View Background */}
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none" />

      {/* Full-Featured Industry-Standard Master Audio Player Bar */}
      <PlayerBar
        currentStory={currentStory}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        playbackRate={playbackRate}
        repeatMode={repeatMode}
        isShuffle={isShuffle}
        isBookmarked={bookmarks.includes(currentStory?.id || '')}
        sleepTimerMinutes={sleepTimerMinutes}
        totalStoriesCount={stories.length}
        onTogglePlay={() => setIsPlaying(p => !p)}
        onSeek={sec => setSeekToTime(sec)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        onVolumeChange={setVolume}
        onToggleMute={() => setIsMuted(m => !m)}
        onPlaybackRateChange={setPlaybackRate}
        onToggleRepeat={() => {
          if (repeatMode === 'off') setRepeatMode('queue');
          else if (repeatMode === 'queue') setRepeatMode('single');
          else setRepeatMode('off');
        }}
        onToggleShuffle={() => setIsShuffle(s => !s)}
        onToggleBookmark={() => currentStory && handleToggleBookmark(currentStory.id)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
        onOpenSoundscape={() => setIsSoundscapeOpen(true)}
      />

      {/* Slide-Up Popup Story List Modal (712 Stories with search & instant play) */}
      <EpisodeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        stories={stories}
        currentStory={currentStory}
        isPlaying={isPlaying}
        activeGenre={activeGenre}
        bookmarks={bookmarks}
        playbackPositions={playbackPositions}
        onSelectStory={story => {
          handleSelectStory(story);
          setIsDrawerOpen(false);
        }}
        onGenreSelect={g => setActiveGenre(g)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Soundscape Mixer Modal */}
      <SoundscapeModal
        isOpen={isSoundscapeOpen}
        onClose={() => setIsSoundscapeOpen(false)}
        isEnabled={soundscapeEnabled}
        activeType={soundscapeType}
        volume={soundscapeVolume}
        onToggleEnabled={handleToggleSoundscape}
        onSelectType={handleSoundscapeTypeChange}
        onVolumeChange={handleSoundscapeVolumeChange}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        activeMinutes={sleepTimerMinutes}
        onSetTimer={handleSetSleepTimer}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        story={currentStory}
        currentTime={currentTime}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </main>
  );
}
