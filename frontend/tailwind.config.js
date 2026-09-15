/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1A371C',
          deep: '#122714',
          dark: '#0D1B0E',
          light: '#284E2B',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          light: '#FFFDF9',
          dark: '#F2ECE1',
        },
        sage: {
          DEFAULT: '#E3ECE0',
          light: '#EFF5EC',
          dark: '#CAD8C5',
        },
        earth: {
          DEFAULT: '#55634F',
          muted: '#768270',
        },
        coral: {
          DEFAULT: '#EE532F',
          hover: '#D6411F',
          light: '#FF6B4A',
        },
        charcoal: '#172016',
      },
      fontFamily: {
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
        sans: ['"DM Sans"', '"Noto Sans Tamil"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

