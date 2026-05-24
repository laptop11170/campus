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
  background: "#0a0a0a",
  surface: "#111111",
  "surface-border": "#1f1f1f",
  accent: "#7c3aed",
  "accent-hover": "#6d28d9",
  primary: "#f9f9f9",
  muted: "#6b7280",
  "muted-dark": "#374151",
  "status-pending": "#f59e0b",
  "status-approved": "#10b981",
  "status-rejected": "#ef4444",
  },
  fontFamily: {
  sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
  mono: ["var(--font-geist-mono)", "monospace"],
  },
  borderRadius: {
  card: "12px",
  input: "8px",
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
