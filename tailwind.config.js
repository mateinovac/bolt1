/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-medium': 'ping-medium 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-fast': 'ping-fast 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 2s ease-in-out infinite',
        'bounce-1': 'bounce-1 1s ease-in-out infinite',
        'bounce-2': 'bounce-2 1s ease-in-out infinite 0.2s',
        'bounce-3': 'bounce-3 1s ease-in-out infinite 0.4s',
        'spin-slow': 'spin 3s linear infinite',
        'spin-slow-reverse': 'spin 3s linear infinite reverse',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.375' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography')
  ],
};
