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
          primary: '#241C24',      // Off-Black
          forest: '#1C4C34',       // Forest Green
          'fresh-leaf': '#34A43C', // Fresh Leaf Green
          chai: '#A44C14',         // Chai Brown
          rust: '#7C2C0C',         // Deep Rust
          amber: '#FC9C34',        // Amber Highlight
          maroon: '#541424',       // Burgundy/Maroon
          burgundy: '#541424',     // Burgundy
          cream: '#FAF7F2',        // Warm Cream
          'light-grey': '#D4D4D4', // Light Grey
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
