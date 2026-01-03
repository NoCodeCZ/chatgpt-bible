/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1440px',
    },
    extend: {
      minHeight: {
        '44': '11rem', // Minimum touch target size (44px)
        '48': '12rem', // Preferred touch target size (48px)
      },
    },
  },
  plugins: [],
}
