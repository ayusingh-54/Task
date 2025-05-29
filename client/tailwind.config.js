/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6", // blue-500
          dark: "#1d4ed8", // blue-700
        },
        secondary: {
          light: "#f59e0b", // amber-500
          dark: "#b45309", // amber-700
        },
        background: {
          light: "#ffffff",
          dark: "#111827", // gray-900
        },
        text: {
          light: "#1f2937", // gray-800
          dark: "#f3f4f6", // gray-100
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
