import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolat:   "#6B3A2A",
        brique:     "#8B4513",
        terra:      "#C4622D",
        taupe:      "#9E8572",
        creme:      "#F0E8DF",
        "creme-dark": "#E0D0C4",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":   "fadeUp 0.8s ease forwards",
        "fade-in":   "fadeIn 1s ease forwards",
        "flip":      "flip 0.6s ease",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
