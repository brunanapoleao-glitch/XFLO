/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#010003',
        night: {
          DEFAULT: '#0d0814',
          2: '#150d22',
        },
        brand: {
          DEFAULT: '#a855f7',
          deep: '#6d28d9',
          glow: '#d95cff',
        },
        mist: {
          DEFAULT: '#f4effa',
          muted: '#b9afcc',
        },
        whatsapp: '#25d366',
      },
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(168, 85, 247, 0.55)',
        'glow-lg': '0 0 64px -12px rgba(168, 85, 247, 0.65)',
      },
    },
  },
  plugins: [],
};
