import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        trattoria: {
          tomato: '#b91c1c',
          tomatoHover: '#991b1b',
          basil: '#15803d',
          crust: '#b45309',
        },
        surface: {
          dark: {
            deep: '#0f0f10',
            bg: '#141415',
            card: '#19191b',
            raised: '#232325',
            hairline: 'rgba(255, 255, 255, 0.08)',
          },
          light: {
            bg: '#fafafa',
            card: '#ffffff',
            raised: '#f4f4f5',
            hairline: 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
