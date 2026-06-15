/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        surface: "rgba(30, 41, 59, 0.6)",
        accentGreen: "#10B981",
        accentPurple: "#D946EF",
        neonPurple: "#8B5CF6",
        neonCyan: "#06B6D4",
        neonOrange: "#F97316"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
