module.exports = {
  content: ["./index.html","./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f8ff",
          100: "#eef1ff",
          200: "#dce0ff",
          300: "#bac2ff",
          400: "#8a98ff",
          500: "#677aff",
          600: "#4b60ff",
          700: "#3446ea",
          800: "#2a38b6",
          900: "#222f96"
        }
      },
      borderRadius: { "2xl":"1.25rem", "3xl":"1.75rem" },
      boxShadow: { soft: "0 20px 60px rgba(0,0,0,0.08)" }
    },
    fontFamily: { sans: ["Inter","ui-sans-serif","system-ui","Apple Color Emoji","Segoe UI Emoji"] }
  },
  plugins: []
}
