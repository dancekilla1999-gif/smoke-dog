import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2.5rem", "2xl": "4rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        noir: "#060505",
        graphite: "#0e0c0a",
        espresso: "#171208",
        gold: {
          DEFAULT: "#b08b5a",
          soft: "#d6b789",
          deep: "#8a6c43",
        },
        bone: "#f5f2ec",
        ash: "#b5aca0",
        moss: "#232a20",
        emerald: {
          DEFAULT: "#0d5c4d",
          soft: "#1a8a72",
          deep: "#064036",
          glow: "rgba(26,138,114,0.35)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.32em",
        wide2: "0.14em",
      },
      maxWidth: { content: "1400px" },
      boxShadow: {
        gold: "0 0 0 1px rgba(176,139,90,0.35), 0 20px 60px -20px rgba(176,139,90,0.25)",
        soft: "0 30px 80px -40px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, transparent, rgba(176,139,90,0.7), transparent)",
        "gold-sheen":
          "linear-gradient(110deg, #8a6c43 0%, #d6b789 42%, #f0dcb8 50%, #d6b789 58%, #8a6c43 100%)",
        "fade-top": "linear-gradient(to bottom, rgba(6,5,5,0), rgba(6,5,5,1))",
        "fade-bottom": "linear-gradient(to top, rgba(6,5,5,0), rgba(6,5,5,1))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1.08) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.18) translate3d(-1.5%, -2%, 0)" },
        },
        sheen: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "35%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateY(18px)", opacity: "0" },
        },
        "marquee-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.32s ease-out",
        "accordion-up": "accordion-up 0.32s ease-out",
        "ken-burns": "ken-burns 22s ease-out forwards",
        sheen: "sheen 6s linear infinite",
        "scroll-dot": "scroll-dot 1.8s ease-in-out infinite",
        "marquee-x": "marquee-x 40s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
