/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Ovo', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        blush: {
          50:  '#FFF8F5',
          100: '#FEEEE7',
          200: '#FDDDD0',
          300: '#FBCAB8',
          400: '#F7AC96',
          500: '#F29478',
        },
        coral: {
          300: '#EFA48F',
          400: '#E8836E',
          500: '#D4695A',
          600: '#B84F3E',
        },
        petal: '#F9EDE8',
        cream: '#FBF7F4',
        bark:  '#6B5B52',
        moss:  '#8A9B7A',
      },
      borderRadius: {
        arch: '9999px 9999px 1.5rem 1.5rem',
        pill: '9999px',
      },
      transitionTimingFunction: {
        bloom: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'slide-out': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(100%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(2.5rem)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        petal: {
          '0%,100%': { transform: 'rotate(-3deg) translateY(0px)' },
          '50%':     { transform: 'rotate(3deg) translateY(-8px)' },
        },
      },
      animation: {
        'slide-in':  'slide-in 0.45s cubic-bezier(0.34,1.1,0.64,1) forwards',
        'slide-out': 'slide-out 0.35s ease-in forwards',
        'fade-up':   'fade-up 0.8s ease forwards',
        'fade-in':   'fade-in 0.6s ease forwards',
        petal:       'petal 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
