import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edfcf2',
          100: '#d4f7df',
          200: '#acedc3',
          300: '#74dfa0',
          400: '#2ca84e',
          500: '#1f8a3c',
          600: '#157030',
          700: '#115a28',
          800: '#104722',
          900: '#0d3b1d',
        },
        ocean: {
          50: '#eef7fc',
          100: '#d5ecf7',
          200: '#a8d8f0',
          300: '#6bbde4',
          400: '#1a8fc4',
          500: '#1a6fa0',
          600: '#165a82',
          700: '#134a6b',
          800: '#113d58',
          900: '#0e324a',
        },
        dark: {
          900: '#0a1628',
          800: '#0f1f36',
          700: '#133352',
          600: '#1c3350',
        },
      },
    },
  },
  plugins: [],
}

export default config
