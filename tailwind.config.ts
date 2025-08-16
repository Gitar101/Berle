import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-dark': '#1A0033',
        'accent-purple': '#8A2BE2',
        'header-border': '#4A0080',
        'chat-bubble-gideon': '#2A004D', // A slightly lighter purple for Gideon's bubbles
        'chat-bubble-lordberle': '#8A2BE2', // Accent purple for Lord Berle's bubbles
        'input-background': '#2A004D', // Darker purple for input area
        'input-border': '#4A0080', // Border for input area
        'text-primary': '#FFFFFF', // White text
        'text-secondary': '#CCCCCC', // Lighter text for timestamps
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;