import type { Config } from 'tailwindcss'

// Editorial palette: near-black, off-white paper, chrome. No accent color.
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink:    '#0A0A0A',
        paper:  '#F2F2F0',
        chrome: {
          50:  '#F7F8F9',
          200: '#DADDE1',
          400: '#A9ADB3',
          600: '#6E737A',
        },
        mute: '#6B6B68',   // secondary text on paper
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // The 10–11px uppercase "spec sheet" voice used for almost everything
        micro: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
        // Product-name size: name in the hero, project titles
        name:  ['0.9375rem', { lineHeight: '1.25rem', letterSpacing: '0.02em' }],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
