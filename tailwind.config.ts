// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'talea-mint': '#57A57A',
        'talea-rose-taupe': '#9D5C63',
        'talea-dark-green': '#00241B',
        'talea-dark-slate-gray': '#254441',
        'talea-dun': '#DCC9B6',
      },
      keyframes: {
        'pulse-border': {
          '0%': { borderColor: 'var(--color-talea-mint)', boxShadow: '0 0 15px var(--color-talea-mint)' },
          '50%': { borderColor: 'var(--color-talea-rose-taupe)', boxShadow: '0 0 25px var(--color-talea-rose-taupe)' },
          '100%': { borderColor: 'var(--color-talea-mint)', boxShadow: '0 0 15px var(--color-talea-mint)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'card-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-border': 'pulse-border 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'card-fade-in': 'card-fade-in 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
