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
        // Palette "Chaleureuse & Accueillante"
        cream: {
          50: "#FFFCF9",
          100: "#FDF7F0",
          200: "#F7EBD9",
          300: "#EEDCC0",
          400: "#E5CDA6",
          500: "#DCC9AA", // Conservé pour compatibilité, mais moins utilisé
        },
        terracotta: {
          50: "#FFF5F2",
          100: "#FFE6E0",
          200: "#FDD0C2",
          300: "#FBAFA0",
          400: "#F48B78", // Plus vif
          500: "#DE6B58", // Plus chaleureux
          600: "#C15242",
          700: "#9E3C2F",
          800: "#7D2E25",
          900: "#5C221C",
        },
        forest: {
          50: "#F2F9F5",
          100: "#E1EFE7",
          200: "#C4DECF",
          300: "#A3C9B4",
          400: "#82B098", // Plus sage/nature
          500: "#63967C",
          600: "#497A62",
          700: "#345C49",
          800: "#244233",
          900: "#162B21",
        },
        golden: {
          50: "#FFFAEB",
          100: "#FFF3CC",
          200: "#FFE699",
          300: "#FFD766",
          400: "#FFC733",
          500: "#FFB000",
          600: "#CC8D00",
          700: "#996A00",
          800: "#664700",
          900: "#332300",
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
          50: "#F7F7F8",
          100: "#EBEBEF",
          200: "#D8D8DF",
          300: "#B9B9C6",
          400: "#9696A6", // Plus doux, légèrement teinté bleu/violet
          500: "#757585",
          600: "#595966",
          700: "#40404A",
          800: "#2C2C33",
          900: "#1A1A1F",
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
