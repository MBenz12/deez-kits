/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '_xl': { 'max': '1600px' },
      '_lg': { 'max': '1200px' },
      '_md': { 'max': '992px' },
      '_sm': { 'max': '768px' },
      '_xs': { 'max': '576px' },
      '_2xl': '1600px',
    },
    colors: {
      'primary': '#7A58FF',
      'theme': '#83FF49',
    },
    extend: {
    }
  },
  plugins: [],
}