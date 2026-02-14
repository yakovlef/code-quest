/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Space theme colors
        'space': {
          900: '#0a0a0f',
          800: '#0f1419',
          700: '#1a1f2e',
          600: '#252b3d',
        },
        'cyber': {
          cyan: '#00ffff',
          green: '#00ff88',
          red: '#ff3366',
          orange: '#ff9933',
          purple: '#9966ff',
        },
        'terminal': {
          bg: '#0d1117',
          text: '#c9d1d9',
          green: '#3fb950',
          red: '#f85149',
          yellow: '#d29922',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'typing': 'typing 0.05s steps(1)',
        'glitch': 'glitch 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        }
      }
    },
  },
  plugins: [],
}
