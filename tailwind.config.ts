import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", ".dark-mode"],
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
          50: "#FFF0F4",
          100: "#FFE0E8",
          200: "#FFB8C8",
          300: "#FF85A3",
          400: "#F54D75",
          500: "#C80040", // Nouvelle couleur de base
          600: "#A60035",
          700: "#85002A",
          800: "#660020",
          900: "#420015",
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
        "medical-blue": {
          50: "#F0F5FA",
          100: "#E1EDF6",
          200: "#C4DBED",
          300: "#99C2DF",
          400: "#66A4CD",
          500: "#3D82B3", // Base pour l'aspect hospitalier
          600: "#2A6694",
          700: "#225177",
          800: "#1E4362",
          900: "#1C3953",
        },
        "hotel-beige": {
          50: "#FCFAF8",
          100: "#F8F3EA",
          200: "#EFE2D0",
          300: "#E2CCB1",
          400: "#D4B48F",
          500: "#C1996C", // Base pour l'aspect hôtellerie / lieu de vie
          600: "#B08355",
          700: "#936644",
          800: "#79543A",
          900: "#624431",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 100%)",
        "gradient-terracotta": "linear-gradient(135deg, #C80040 0%, #F54D75 100%)",
        "gradient-forest": "linear-gradient(135deg, #4A6D5B 0%, #6A9A7F 100%)",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(139, 115, 85, 0.12)",
        warm: "0 8px 30px -4px rgba(200, 0, 64, 0.2)",
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
