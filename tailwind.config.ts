import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#06101E",
        slatecore: "#0B1628",
        cyber: "#0EA5E9",
        cyanGlow: "#38BDF8",
        steel: "#94A3B8",
        panel: "#0F1C33",
        panelSoft: "#14223D",
        aurora: "#102540",
        success: "#34D399",
        warning: "#F59E0B",
        danger: "#F87171",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 189, 248, 0.16), 0 18px 42px rgba(6, 16, 30, 0.24)",
        panel: "0 18px 44px rgba(2, 8, 23, 0.26)",
        focus: "0 0 0 3px rgba(56, 189, 248, 0.18)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
        radial:
          "radial-gradient(circle at top, rgba(56,189,248,0.14), transparent 32%), radial-gradient(circle at 82% 18%, rgba(14,165,233,0.08), transparent 24%)",
        aurora:
          "linear-gradient(135deg, rgba(56,189,248,0.16), rgba(11,22,40,0.06) 38%, rgba(14,165,233,0.08) 68%, rgba(255,255,255,0.02))",
      },
      animation: {
        "float-soft": "floatSoft 7s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "fade-up": "fadeUp 0.75s ease-out both",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
      },
      keyframes: {
        floatSoft: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.82", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
      },
      fontFamily: {
        heading: ["var(--font-changa)", "sans-serif"],
        body: ["var(--font-ibm-plex-sans-arabic)", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          lg: "2rem",
          xl: "2.5rem",
        },
      },
    },
  },
  plugins: [],
};

export default config;
