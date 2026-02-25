import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      // ─── ACCENT COLOR ────────────────────────────────────────────────────────────
      // Current theme: Black + Aurora (violet/indigo).
      // Swap out this palette to retheme the entire site.
      colors: {
        accent: {
          50:  '#fffde7',
          100: '#fff9c4',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffee58',
          500: '#FFE600',   // primary bright yellow
          600: '#FFD600',
          700: '#FFC400',
          800: '#FFAB00',
          900: '#FF8F00',
          950: '#FF6F00',
        },
      },
      // ─── SPACING & LAYOUT ────────────────────────────────────────────────────────
      maxWidth: {
        site: '1200px',
      },
      // ─── ANIMATIONS ──────────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease forwards',
        'fade-in': 'fade-in 0.5s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
