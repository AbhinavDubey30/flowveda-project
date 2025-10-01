/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'water-blue': '#0ea5e9',
        'water-dark': '#0369a1',
        'safe-green': '#10b981',
        'warning-yellow': '#f59e0b',
        'danger-red': '#ef4444',
      }
    },
  },
  plugins: [],
}
