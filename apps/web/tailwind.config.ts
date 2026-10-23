import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#241C24',
          green: '#241C24',
          forest: '#241C24',
          'leaf-green': '#34A43C',
          leaf: '#34A43C',
          chai: '#A44C14',
          rust: '#7C2C0C',
          amber: '#FC9C34',
          burgundy: '#541424',
          maroon: '#541424',
          cream: '#FAF7F2',
          grey: '#D4D4D4',
          'light-grey': '#D4D4D4',
          white: '#FFFFFF',
        },
        sharon: {
          black: '#241C24',
          green: '#241C24',
          forest: '#241C24',
          'leaf-green': '#34A43C',
          leaf: '#34A43C',
          chai: '#A44C14',
          rust: '#7C2C0C',
          amber: '#FC9C34',
          burgundy: '#541424',
          maroon: '#541424',
          cream: '#FAF7F2',
          grey: '#D4D4D4',
          'light-grey': '#D4D4D4',
          white: '#FFFFFF',
        },
      },
      spacing: {
        '22': '5.5rem',
        '26': '6.5rem',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"SoDo Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        body: ['"SoDo Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'warm': '0 4px 20px -2px rgba(84, 20, 36, 0.08)',
        'warm-lg': '0 10px 30px -4px rgba(84, 20, 36, 0.12)',
        'warm-xl': '0 20px 35px -5px rgba(84, 20, 36, 0.18), 0 8px 10px -6px rgba(84, 20, 36, 0.1)',
        'green-subtle': '0 4px 20px -2px rgba(28, 76, 52, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
