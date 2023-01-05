/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx}", "./public/*.html"],
  theme: {
    extend: {
        fontFamily: {
          sans: ['Nunito Sans', 'sans-serif'],
        },
    },
    screens: {
      'md':'640px',
      '3xl': "1700px",
      'xxs': '200px'
    },
  },
  plugins: [],
});
