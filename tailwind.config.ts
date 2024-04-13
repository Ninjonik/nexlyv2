import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateRows: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '20': 'repeat(16, minmax(0, 1fr))',
      },
      gridRow: {
        'span-14': 'span 14 / span 14',
        'span-16': 'span 16 / span 16',
      }
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          "color-scheme": "light",
          "primary": "oklch(49.12% 0.3096 275.75)",
          "secondary": "oklch(69.71% 0.329 342.55)",
          "secondary-content": "oklch(98.71% 0.0106 342.55)",
          "accent": "oklch(76.76% 0.184 183.61)",
          "neutral": "#2B3440",
          "neutral-content": "#D7DDE4",
          "base-300": "#F3F3F3",
          "base-200": "#E8E8E8",
          "base-100": "#E0E0E0",
          "base-content": "#1f2937",
        },
        dark: {
          "color-scheme": "dark",
          "primary": "oklch(65.69% 0.196 275.75)",
          "secondary": "oklch(74.8% 0.26 342.55)",
          "accent": "oklch(74.51% 0.167 183.61)",
          "neutral": "#2a323c",
          "neutral-content": "#A6ADBB",
          "base-100": "#242424",
          "base-200": "#282828",
          "base-300": "#373737",
          "base-content": "#A6ADBB",
        },
      }
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
