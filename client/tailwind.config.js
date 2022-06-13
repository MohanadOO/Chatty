module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar'), require('tailwindcss-textshadow')],
}
