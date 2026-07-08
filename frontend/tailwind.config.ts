import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9F4EE',
        gold: {
          DEFAULT: '#C89B3C',
          dark: '#A47425',
          light: '#DDB96A',
        },
        brown: {
          DEFAULT: '#473428',
          light: '#7A5C4A',
          dark: '#2E1F16',
        },
        dark: '#1D1D1D',
        cream: '#F9F4EE',
        ivory: '#FAF8F5',
        'off-white': '#F2EDE6',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gold-shine': 'goldShine 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        goldShine: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C89B3C 0%, #DDB96A 40%, #A47425 60%, #C89B3C 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1D1D1D 0%, #473428 100%)',
        'luxury-gradient': 'linear-gradient(180deg, #F9F4EE 0%, #FAF8F5 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(200,155,60,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(200, 155, 60, 0.3)',
        'gold-lg': '0 8px 40px rgba(200, 155, 60, 0.4)',
        'luxury': '0 20px 60px rgba(71, 52, 40, 0.15)',
        'card': '0 2px 20px rgba(71, 52, 40, 0.08)',
      },
      borderRadius: {
        'luxury': '2px',
      },
    },
  },
  plugins: [],
};

export default config;
