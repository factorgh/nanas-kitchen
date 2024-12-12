/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      extend: {
        fontFamily: {
          cabin: ['"Cabin"', "sans-serif"],
          kaushan: ['"Kaushan Script"', "cursive"],
        },
      },
    },
  },
  plugins: [],
};
