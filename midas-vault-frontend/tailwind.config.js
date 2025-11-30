/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midas-gold': '#E6C200',
        'midas-dark': '#222222',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(230, 194, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(230, 194, 0, 0.8), 0 0 30px rgba(230, 194, 0, 0.6)' },
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(45deg, #E6C200, #FFD700, #E6C200)',
        'dark-gradient': 'linear-gradient(135deg, #222222 0%, #000000 100%)',
        'premium-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(230, 194, 0, 0.3)',
        'gold-lg': '0 0 30px rgba(230, 194, 0, 0.5)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(230, 194, 0, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      scale: {
        '102': '1.02',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}