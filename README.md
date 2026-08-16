# 🌙 রাত জাগা (Raat Jaga) — Sunday Suspense Audio Player

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/Daily_Sync-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

**A cinematic, late-night Bengali suspense radio web application streaming 700+ timeless Sunday Suspense audio stories with procedural ambient soundscapes, intelligent resume bookmarks, and automated daily playlist synchronization.**

*Dedicated with immense love and respect to **Mirchi Bangla** and the legendary narrators and artists behind Sunday Suspense.*

</div>

---

## ✨ Features

- 📻 **Cinematic Radio Experience**: Immersive dark aesthetic (`#070709`) with dynamic genre-based ambient blooms, glassmorphic HUD controls, and smooth crossfades.
- 📚 **700+ Stories Catalog**: Rich collection categorized across **Horror (ভৌতিক)**, **Thriller (রোমাঞ্চকর)**, **Mystery (গোয়েন্দা)**, **Classics (কালজয়ী সাহিত্য)**, and **Adventure (অভিযান)**.
- ⚡ **Instant Fuzzy Search**: High-performance title and author search (supporting both Bengali script and English transliteration) powered by Fuse.js.
- 🌧️ **Procedural Web Audio Soundscapes**: Built-in real-time ambient noise synthesizer running concurrently with the story:
  - 🌧️ *Rain on Window* (Brownian filtered pink noise)
  - 🦗 *Midnight Crickets* (Modulated dual sine oscillators)
  - 📻 *Vintage Vinyl Crackle* (Dust pop and hiss emulation)
  - 💨 *Wind Gusts* (Dynamic band-pass sweep)
- 💾 **Smart Resume & History**: Automatically saves playback timestamps to local storage so you can pick up exactly where you left off.
- ⭐ **Personal Library & Bookmarks**: Star and save your favorite stories for quick one-tap access.
- ⏱️ **Sleep Timer**: Auto-pause after 15m, 30m, 45m, 60m, or when the current story ends.
- 🎚️ **Playback Speed Control**: Seamlessly adjust story pace from `0.75x` up to `1.5x`.
- 👥 **Live Presence Counter**: Real-time indicator showing active concurrent listeners.
- 🔄 **Automated Daily Sync Pipeline**: GitHub Actions workflow triggers daily at 7:00 PM IST (13:30 UTC) to fetch and categorize newly released Sunday Suspense episodes via `yt-dlp`.
- ⌨️ **Full Keyboard Navigation**: Control playback, seek, adjust volume, and switch soundscapes directly from your keyboard.
- 📱 **Mobile & PWA Ready**: Installable as a Progressive Web App on mobile and desktop devices.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Function (Bengali / English) |
| :--- | :--- |
| <kbd>Space</kbd> | প্লে / পজ (Play / Pause) |
| <kbd>←</kbd> / <kbd>→</kbd> | ১০ সেকেন্ড আগে / পেছনে (Seek ±10s) |
| <kbd>↑</kbd> / <kbd>↓</kbd> | ভলিউম বাড়ানো / কমানো (Volume ±5%) |
| <kbd>M</kbd> | মিউট / আনমিউট (Mute Toggle) |
| <kbd>N</kbd> / <kbd>P</kbd> | পরবর্তী / পূর্ববর্তী গল্প (Next / Previous Story) |
| <kbd>E</kbd> | গল্পের তালিকা ড্রয়ার (Toggle Episode Drawer) |
| <kbd>S</kbd> | ঘুমের টাইমার (Sleep Timer Modal) |
| <kbd>A</kbd> | আবহ সঙ্গীত (Ambient Soundscape Modal) |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Glassmorphism
- **Icons**: [Lucide React](https://lucide.dev/)
- **Search Engine**: [Fuse.js](https://www.fusejs.io/)
- **Audio Synthesizer**: Web Audio API (zero external audio file dependencies for ambient sounds)
- **Data Scraping & Sync**: Python 3.11 + `yt-dlp`
- **CI/CD Automation**: GitHub Actions Schedule Cron

---

## 📁 Repository Structure

```text
sunday_suspense_audio_player/
├── .github/
│   └── workflows/
│       └── daily_sync.yml          # Automated 7:00 PM IST playlist sync
├── app/
│   ├── api/
│   │   ├── content/                # Story catalog API endpoint
│   │   ├── cron/sync/              # Cron webhook sync endpoint
│   │   ├── presence/               # Live listener tracking endpoint
│   │   └── sync/                   # Manual sync endpoint
│   ├── story/[id]/                 # Deep-link dynamic story route
│   ├── globals.css                 # Global styles and ambient animations
│   ├── layout.tsx                  # Root layout & PWA metadata
│   └── page.tsx                    # Main player experience
├── components/
│   ├── EpisodeDrawer.tsx           # Searchable playlist drawer
│   ├── Header.tsx                  # Top navigation & genre pills
│   ├── HeroBackground.tsx          # Dynamic atmospheric background
│   ├── KeyboardShortcutsModal.tsx  # Shortcuts helper modal
│   ├── PlayerBar.tsx               # Bottom playback controls & scrubber
│   ├── ResumeBanner.tsx            # "Resume where you left off" prompt
│   ├── ShareModal.tsx              # Deep link & timestamp sharing
│   ├── SleepTimerModal.tsx         # Sleep timer selection
│   ├── SoundscapeModal.tsx         # Ambient sound generator controls
│   ├── StoryImage.tsx              # Resilient thumbnail renderer
│   ├── StoryShelf.tsx              # Curated story carousel
│   ├── TonightsPick.tsx            # Featured story spotlight banner
│   └── YouTubePlayer.tsx           # Hidden YouTube IFrame API controller
├── data/
│   └── content.json                # 700+ indexed stories & metadata
├── lib/
│   ├── content.ts                  # Fuse search & catalog filters
│   ├── resume.ts                   # LocalStorage progress persistence
│   ├── soundscape.ts               # Procedural Web Audio synthesizer
│   └── types.ts                    # TypeScript types and definitions
├── public/
│   ├── hero/all.png                # Ambient background artwork
│   ├── logo.png                    # High-resolution radio station badge
│   └── manifest.json               # PWA configuration
├── scripts/
│   ├── daily_sync_scheduler.py     # Standalone Python daemon scheduler
│   ├── fetch_playlist.py           # Core yt-dlp scraping & author parser
│   └── setup_windows_scheduler.bat # Windows Task Scheduler one-click installer
├── .gitignore
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.18.0 or higher
- **npm** / **yarn** / **pnpm**
- **Python**: 3.10+ (only required if running the sync script locally)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/sunday_suspense_audio_player.git
cd sunday_suspense_audio_player
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start listening.

### 3. Build for Production

```bash
npm run build
npm run start
```

---

## 🔄 Daily Sync Pipeline

The story catalog (`data/content.json`) is maintained automatically:

1. **GitHub Actions**: Configured in [`.github/workflows/daily_sync.yml`](.github/workflows/daily_sync.yml) to run daily at **13:30 UTC (7:00 PM IST)**. It extracts new episodes, parses author and title details, downloads thumbnail URLs, updates `data/content.json`, and commits back to the repository.
2. **Local Run**:
   ```bash
   pip install yt-dlp pillow
   python scripts/fetch_playlist.py
   ```
3. **Background Daemon (Optional)**:
   ```bash
   python scripts/daily_sync_scheduler.py
   ```

---

## ⚖️ Disclaimer & Copyright Notice

This project is a non-commercial, fan-made open-source platform created strictly for educational and archival enjoyment. 

All audio stories, voices, background scores, and intellectual properties are the exclusive copyright of **Mirchi Bangla**, **Radio Mirchi (Entertainment Network India Limited)**, and the respective authors / copyright holders. All playback streams originate directly from the official YouTube uploads via the YouTube IFrame API.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
