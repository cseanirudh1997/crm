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
        brand: {
          50:  '#f0f4ff',
          100: '#dde5ff',
          200: '#c3cfff',
          300: '#9aaeff',
          400: '#6d84ff',
          500: '#4a5eff',
          600: '#3a3ef5',
          700: '#2d2dd8',
          800: '#2626af',
          900: '#242589',
          950: '#161653',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        neon: {
          blue:   '#4f8eff',
          purple: '#9b6dff',
          pink:   '#ff6db2',
          cyan:   '#00d4ff',
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
          '50%':      { 'border-color': '#4a5eff' },
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
        'glow-sm':  '0 0 15px rgba(74, 94, 255, 0.3)',
        'glow':     '0 0 30px rgba(74, 94, 255, 0.4)',
        'glow-lg':  '0 0 60px rgba(74, 94, 255, 0.5)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.4)',
        'glass':    '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card':     '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
