import type { Config } from "tailwindcss";

const config: Config = {
  content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
  extend: {
  colors: {
  // Backgrounds
  bg: "#0b0a0d",
  "bg-elev": "#100f13",
  surface: "#16151a",
  "surface-2": "#1c1a20",
  "surface-3": "#232128",
  "surface-hi": "#2a2832",

  // Text
  text: "#f4f1ec",
  "text-2": "#cfcad1",
  "text-mute": "#8a8690",
  "text-dim": "#5a5660",
  "text-inverse": "#0b0a0d",

  // Brand / accent
  accent: "#c6f74a",
  "accent-ink": "#1c2400",
  "accent-soft": "rgba(198, 247, 74, 0.12)",
  "accent-line": "rgba(198, 247, 74, 0.35)",
  "accent-deep": "#95c100",

  // Borders
  border: "rgba(255,255,255,0.08)",
  "border-strong": "rgba(255,255,255,0.16)",
  divider: "rgba(255,255,255,0.06)",

  // Semantic
  danger: "#ff6b6b",
  "danger-soft": "rgba(255, 107, 107, 0.12)",
  success: "#c6f74a",
  amber: "#ffb259",
  "amber-soft": "rgba(255, 178, 89, 0.12)",
  "amber-deep": "#c47a1a",

  // Category swatches
  "cat-product": "#ffb259",
  "cat-service": "#5dd6c1",
  "cat-event": "#ff7ba0",
  "cat-learning": "#6bb6ff",

  // Legacy aliases (keep for backward compat)
  background: "#0b0a0d",
  foreground: "#f4f1ec",
  "surface-border": "rgba(255,255,255,0.08)",
  primary: "#f4f1ec",
  muted: "#8a8690",
  "muted-dark": "#5a5660",
  "status-pending": "#ffb259",
  "status-approved": "#c6f74a",
  "status-rejected": "#ff6b6b",
  },
  fontFamily: {
  sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
  mono: ["var(--font-geist-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
  display: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
  },
  borderRadius: {
  card: "10px",
  input: "6px",
  sm: "4px",
  md: "6px",
  lg: "10px",
  xl: "14px",
  },
  fontSize: {
  xs: ["12px", { lineHeight: "1.4" }],
  sm: ["13px", { lineHeight: "1.5" }],
  base: ["15px", { lineHeight: "1.6" }],
  md: ["17px", { lineHeight: "1.5" }],
  lg: ["20px", { lineHeight: "1.4" }],
  xl: ["24px", { lineHeight: "1.2" }],
  "2xl": ["30px", { lineHeight: "1.15" }],
  "3xl": ["38px", { lineHeight: "1.1" }],
  "4xl": ["48px", { lineHeight: "1.05" }],
  "5xl": ["64px", { lineHeight: "1.0" }],
  },
  spacing: {
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "7": "32px",
  "8": "40px",
  "9": "56px",
  "10": "72px",
  },
  animation: {
  "fade-in": "fadeIn 0.3s ease-out",
  "slide-up": "slideUp 0.3s ease-out",
  },
  keyframes: {
  fadeIn: {
  "0%": { opacity: "0" },
  "100%": { opacity: "1" },
  },
  slideUp: {
  "0%": { opacity: "0", transform: "translateY(10px)" },
  "100%": { opacity: "1", transform: "translateY(0)" },
  },
  },
  },
  },
  plugins: [],
};
export default config;
