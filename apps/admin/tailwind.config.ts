import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sharon: {
          primary: '#241C24',
          black: '#241C24',
          forest: '#1C4C34',
          green: '#1C4C34',
          'fresh-leaf': '#34A43C',
          leaf: '#34A43C',
          chai: '#A44C14',
          rust: '#7C2C0C',
          amber: '#FC9C34',
          maroon: '#541424',
          burgundy: '#541424',
          'light-grey': '#D4D4D4',
          grey: '#D4D4D4',
          white: '#FFFFFF',
          cream: '#FAF7F2',
        },
        brand: {
          primary: '#241C24',
          black: '#241C24',
          forest: '#1C4C34',
          green: '#1C4C34',
          'fresh-leaf': '#34A43C',
          leaf: '#34A43C',
          chai: '#A44C14',
          rust: '#7C2C0C',
          amber: '#FC9C34',
          maroon: '#541424',
          burgundy: '#541424',
          'light-grey': '#D4D4D4',
          grey: '#D4D4D4',
          white: '#FFFFFF',
          cream: '#FAF7F2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};

export default config;
