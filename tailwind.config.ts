import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SarcasmStack dark brand palette
        ink: {
          950: "#0a0a0b",
          900: "#111113",
          800: "#18181b",
          700: "#232327",
          600: "#2f2f35",
        },
        accent: {
          // hot magenta-red — the sarcastic pop
          DEFAULT: "#ff3b6b",
          soft: "#ff6b8a",
          dim: "#c92a52",
        },
        highlight: {
          // acid yellow for warnings/CTA hover
          DEFAULT: "#facc15",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
