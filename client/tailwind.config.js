// tailwind.config.js
const {nextui} = require("@nextui-org/react");

// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        drip: 'drip 2s infinite', // Định nghĩa lớp animation "drip"
      },
      keyframes: {
        drip: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};