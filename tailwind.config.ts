import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        radio: {
          dark: "#08080a",
          card: "rgba(18, 18, 24, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.05)",
        },
        genre: {
          thriller: "#f59e0b",
          horror: "#10b981",
          mystery: "#ef4444",
          novel: "#d97706",
          adventure: "#06b6d4",
        }
      },
      fontFamily: {
        bengali: ["var(--font-bengali)", "Tiro Bangla", "Noto Serif Bengali", "serif"],
        sans: ["var(--font-sans)", "Outfit", "Inter", "sans-serif"],
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
