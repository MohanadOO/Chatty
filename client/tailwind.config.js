module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar'), require('tailwindcss-textshadow')],
}
