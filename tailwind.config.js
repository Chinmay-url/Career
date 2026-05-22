/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0b1020",
        surface: "#111827",
        panel: "#172033",
        line: "#283245",
        accent: "#2dd4bf",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0, 0, 0, 0.24)",
      },
    },
  },
  plugins: [],
};
