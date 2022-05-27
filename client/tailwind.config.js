module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary-50': '#ebe8f7',
        'primary-400': '#7061c7',
        'primary-500': '#5447BD',
        'primary-white': '#EDEDED',
        'primary-text': '#eff7ca',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
