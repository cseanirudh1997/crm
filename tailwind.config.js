/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Gold / luxury palette — maps onto the same brand-* / accent-* class names
        brand: {
          50:  '#fdfaf0',
          100: '#faf3d0',
          200: '#f5e49e',
          300: '#edcc62',
          400: '#e2b430',   // primary gold
          500: '#c99a1a',   // brand gold
          600: '#a67c10',
          700: '#7d5c0b',
          800: '#5a4009',
          900: '#3a2a06',
          950: '#1e1503',
        },
        accent: {
          300: '#e8d5b0',
          400: '#d4b483',   // warm beige-gold
          500: '#b8915a',   // accent bronze
          600: '#9a7040',
          700: '#7a5530',
          800: '#5e3e22',
          900: '#432c17',
          950: '#271908',
        },
        neon: {
          blue:   '#e2b430',   // re-mapped to gold (keeps .typing-cursor caret color)
          purple: '#d4b483',
          pink:   '#c99a1a',
          cyan:   '#f0d080',
        },
      },
      animation: {
        'gradient-x':    'gradient-x 8s ease infinite',
        'gradient-y':    'gradient-y 8s ease infinite',
        'float':         'float 6s ease-in-out infinite',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':     'spin 8s linear infinite',
        'typing':        'typing 3.5s steps(40,end) forwards',
        'blink-caret':   'blink-caret 0.75s step-end infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'counter':       'counter 2s ease-out forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        'gradient-y': {
          '0%, 100%': { 'background-position': '50% 0%' },
          '50%':      { 'background-position': '50% 100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        typing: {
          from: { width: '0' },
          to:   { width: '100%' },
        },
        'blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%':      { 'border-color': '#e2b430' },
        },
        shimmer: {
          '0%':   { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm':     '0 0 15px rgba(201, 154, 26, 0.3)',
        'glow':        '0 0 30px rgba(201, 154, 26, 0.4)',
        'glow-lg':     '0 0 60px rgba(201, 154, 26, 0.5)',
        'glow-purple': '0 0 30px rgba(184, 145, 90, 0.4)',
        'glass':       '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.5)',
        'gold':        '0 4px 24px rgba(201, 154, 26, 0.25)',
      },
    },
  },
  plugins: [],
}
