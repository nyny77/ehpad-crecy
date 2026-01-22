import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette chaude "Résidence Hôtelière"
        cream: {
          50: "#FDFCFA",
          100: "#FAF6F0",
          200: "#F5EDE0",
          300: "#EDE1CE",
          400: "#E5D5BC",
          500: "#DCC9AA",
        },
        terracotta: {
          50: "#FDF5F3",
          100: "#FCE8E4",
          200: "#FAD5CD",
          300: "#F5B8AA",
          400: "#E08F7A",
          500: "#C17767",
          600: "#A65E4E",
          700: "#8A4A3D",
          800: "#6F3B31",
          900: "#5A3029",
        },
        forest: {
          50: "#F0F5F2",
          100: "#DCE8E0",
          200: "#B9D1C3",
          300: "#8FB5A0",
          400: "#6A9A7F",
          500: "#4A6D5B",
          600: "#3B574A",
          700: "#2F453B",
          800: "#26382F",
          900: "#1F2E27",
        },
        wood: {
          50: "#FAF8F5",
          100: "#F2EDE6",
          200: "#E5DCD0",
          300: "#D2C4B0",
          400: "#BBA78C",
          500: "#8B7355",
          600: "#745F46",
          700: "#5D4C38",
          800: "#4A3D2E",
          900: "#3D3226",
        },
        charcoal: {
          50: "#F6F6F6",
          100: "#E7E7E7",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#6D6D6D",
          600: "#5D5D5D",
          700: "#4F4F4F",
          800: "#454545",
          900: "#3D3D3D",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 100%)",
        "gradient-terracotta": "linear-gradient(135deg, #C17767 0%, #E08F7A 100%)",
        "gradient-forest": "linear-gradient(135deg, #4A6D5B 0%, #6A9A7F 100%)",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(139, 115, 85, 0.12)",
        warm: "0 8px 30px -4px rgba(193, 119, 103, 0.2)",
        card: "0 2px 10px -2px rgba(0, 0, 0, 0.08), 0 4px 20px -4px rgba(139, 115, 85, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
