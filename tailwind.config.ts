import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        radio: {
          dark: "#000000",
          card: "rgba(24, 24, 24, 0.9)",
          border: "rgba(255, 255, 255, 0.07)",
          hover: "rgba(255, 255, 255, 0.05)",
        },
        // Poster-inspired brand red mapped onto the amber scale so every existing
        // `amber-*` utility class across the app renders as the Sunday Suspense red.
        amber: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        genre: {
          thriller: "#dc2626",
          horror: "#dc2626",
          mystery: "#2563eb",
          novel: "#b45309",
          adventure: "#16a34a",
        }
      },
      fontFamily: {
        bengali: ["var(--font-bengali)", "Tiro Bangla", "Noto Serif Bengali", "serif"],
        sans: ["var(--font-sans)", "Poppins", "Outfit", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fog-drift": "fog 60s linear infinite",
        "flicker": "flicker 4s ease infinite",
        "equalizer-1": "equalizer 0.8s ease-in-out infinite alternate",
        "equalizer-2": "equalizer 1.1s ease-in-out infinite alternate 0.2s",
        "equalizer-3": "equalizer 0.6s ease-in-out infinite alternate 0.4s",
        "equalizer-4": "equalizer 0.9s ease-in-out infinite alternate 0.1s",
      },
      keyframes: {
        fog: {
          "0%": { transform: "translateX(0%)" },
          "50%": { transform: "translateX(-25%)" },
          "100%": { transform: "translateX(0%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "41.99%": { opacity: "1" },
          "42%": { opacity: "0.8" },
          "43%": { opacity: "1" },
          "45%": { opacity: "0.3" },
          "46%": { opacity: "1" },
        },
        equalizer: {
          "0%": { height: "4px" },
          "100%": { height: "20px" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
