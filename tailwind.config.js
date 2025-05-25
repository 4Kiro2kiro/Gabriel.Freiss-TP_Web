/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'minecraft-dirt': '#8B5E34',
        'minecraft-grass': '#567D46',
        'minecraft-stone': '#828282',
        'minecraft-wood': '#9B6E3D',
        'minecraft-obsidian': '#1B1B1B',
        'minecraft-diamond': '#4AEDD9',
        'minecraft-gold': '#FFAA00',
        'minecraft-emerald': '#00D93A',
      },
      fontFamily: {
        'minecraft': ['"VT323"', 'monospace'],
        'pixelated': ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        minecraft: {
          "primary": "#4AEDD9", // diamond
          "secondary": "#9B6E3D", // wood
          "accent": "#FFAA00", // gold
          "neutral": "#8B5E34", // dirt
          "base-100": "#1B1B1B", // obsidian
          "info": "#3ABFF8",
          "success": "#00D93A", // emerald
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
} 