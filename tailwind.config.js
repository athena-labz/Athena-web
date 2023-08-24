/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-blue": "#63B3ED",
        "secundary-blue": "#4299e1",
        "dark-blue": "#3b82f6",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
