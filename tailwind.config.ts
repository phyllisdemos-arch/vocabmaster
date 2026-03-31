import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1E40AF",
        },
        accent: {
          orange: "#F97316",
          green: "#10B981",
        },
        background: "#F8FAFC",
        surface: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "cursive"],
        body: ["var(--font-comic)", "cursive"],
      },
      boxShadow: {
        clay: "12px 12px 24px rgba(37, 99, 235, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9), inset 2px 2px 4px rgba(255, 255, 255, 0.8)",
        "clay-sm": "8px 8px 16px rgba(37, 99, 235, 0.12), -8px -8px 16px rgba(255, 255, 255, 0.85)",
        "clay-hover": "16px 16px 32px rgba(37, 99, 235, 0.2), -16px -16px 32px rgba(255, 255, 255, 0.95)",
      },
    },
  },
  plugins: [],
};
export default config;
