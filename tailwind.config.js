
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        easya: {
          bg: '#0a0a0c',
          purple: '#a855f7',
          blue: '#1e40af',
          green: '#00ffa3',
          card: 'rgba(17, 17, 26, 0.4)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        bagel: ['"Bagel Fat One"', 'cursive'],
      },
      animation: {
        'easya-pulse': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 10s ease-in-out infinite alternate',
      },
      screens: {
        'xs': '475px',
      },
      keyframes: {
        glow: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(20px, 20px) scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
