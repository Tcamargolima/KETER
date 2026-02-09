/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          primary: '#6B46C1',
          50: '#f3e7ff',
          100: '#e1ccff',
          200: '#c199ff',
          300: '#a066ff',
          400: '#8033ff',
          500: '#6B46C1',
          600: '#5a3ba0',
          700: '#482f80',
          800: '#372360',
          900: '#261740',
        },
        amber: {
          primary: '#F59E0B',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
