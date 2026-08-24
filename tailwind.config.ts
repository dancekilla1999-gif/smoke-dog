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
        // Smoke Dog palette: charcoal gray + warm brown + glass
        noir: "#0B0B0D",
        graphite: "#141416",
        espresso: "#1C1916",
        stone: {
          DEFAULT: "#2A2724",
          soft: "#3D3833",
          muted: "#5C554C",
        },
        gold: {
          DEFAULT: "#C09268",
          soft: "#D3B685",
          deep: "#7A5A38",
          glow: "rgba(166,124,82,0.25)",
        },
        bone: "#EDE6DC",
        ash: "#B5AEA3",
        glass: {
          DEFAULT: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.12)",
          brown: "rgba(166,124,82,0.08)",
        },
        moss: "#1E1C18",
        emerald: {
          DEFAULT: "#5C554C",
          soft: "#8A8178",
          deep: "#2A2724",
          glow: "rgba(166,124,82,0.2)",
        },
      },
      fontSize: {
        // Шкала поднята на шаг ради читаемости: базовые 12/14/16 px в тёмной
        // теме с тонким шрифтом мелковаты для возрастного зрения.
        xs: ["0.8125rem", { lineHeight: "1.5" }],     // 13px
        sm: ["0.9375rem", { lineHeight: "1.65" }],    // 15px
        base: ["1.0625rem", { lineHeight: "1.75" }],  // 17px
        lg: ["1.1875rem", { lineHeight: "1.7" }],     // 19px
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
        wide2: "0.12em",
      },
      maxWidth: { content: "1400px" },
      boxShadow: {
        gold: "0 0 0 1px rgba(166,124,82,0.3), 0 20px 60px -20px rgba(166,124,82,0.2)",
        soft: "0 30px 80px -40px rgba(0,0,0,0.85)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, transparent, rgba(166,124,82,0.65), transparent)",
        "gold-sheen":
          "linear-gradient(110deg, #7A5A38 0%, #C4A574 42%, #E8D5B5 50%, #C4A574 58%, #7A5A38 100%)",
        "fade-top": "linear-gradient(to bottom, rgba(11,11,13,0), rgba(11,11,13,1))",
        "fade-bottom": "linear-gradient(to top, rgba(11,11,13,0), rgba(11,11,13,1))",
        "glass-panel":
          "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(166,124,82,0.04) 50%, rgba(255,255,255,0.02) 100%)",
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
