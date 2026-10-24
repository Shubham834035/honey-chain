/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          amber: "#F4A623",
          light: "#FDBA74",
          dark: "#D97706",
          brown: "#6B3F20",
          cream: "#FFF9ED",
          soft: "#FEF3C7",
        },
        forest: {
          DEFAULT: "#2F6B45",
          light: "#408E5C",
          dark: "#1E472D",
          subtle: "#E8F5E9",
        },
        charcoal: {
          DEFAULT: "#1F2937",
          muted: "#4B5563",
          subtle: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cal)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(107, 63, 32, 0.06), 0 2px 6px -1px rgba(107, 63, 32, 0.04)",
        honey: "0 10px 25px -5px rgba(244, 166, 35, 0.3)",
      },
    },
  },
  plugins: [],
};
