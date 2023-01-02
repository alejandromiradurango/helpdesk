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
      '3xl': "1700px"
    },
  },
  plugins: [],
});
