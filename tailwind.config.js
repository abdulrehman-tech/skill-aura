/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        aura: {
          teal: "#14b8a6",
          sky: "#0ea5e9",
          indigo: "#4f46e5",
          violet: "#8b5cf6",
          orange: "#f97316",
        },
      },
      backgroundImage: {
        "aura-gradient": "linear-gradient(135deg,#14b8a6 0%,#0ea5e9 35%,#4f46e5 65%,#8b5cf6 90%)",
        "aura-soft": "linear-gradient(135deg,#eef2ff 0%,#e0f2fe 50%,#f3e8ff 100%)",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(79,70,229,0.12)",
        glow: "0 0 40px -8px rgba(139,92,246,0.45)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
