module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary-50': '#ebe8f7',
        'primary-400': '#7061c7',
        'primary-500': '#5447BD',
        'primary-white': '#EDEDED',
        'primary-text': '#eff7ca',
        'primary-dark-400': '#161819',
        'primary-dark-600': '#181A1B',
      },
    },
  },
  plugins: [require('tailwind-scrollbar'), require('tailwindcss-textshadow')],
}
