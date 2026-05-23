/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#090d18",
        surface: "#101827",
        panel: "#172033",
        line: "#2b3548",
        accent: "#2dd4bf",
        warning: "#f59e0b",
        danger: "#ef4444",
        ink: "#e7eef8",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0, 0, 0, 0.24)",
      },
    },
  },
  plugins: [],
};
