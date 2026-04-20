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
        midnight: "#050816",
        slatecore: "#0b1326",
        cyber: "#4cc9f0",
        cyanGlow: "#7ee7ff",
        steel: "#93a4bf",
        panel: "#101a33",
        panelSoft: "#131f3d",
        aurora: "#13345e",
        success: "#5fe1a6",
        warning: "#f2c14e",
        danger: "#ff6b81",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(126, 231, 255, 0.18), 0 20px 80px rgba(8, 24, 54, 0.45)",
        panel: "0 24px 72px rgba(2, 8, 23, 0.4)",
        focus: "0 0 0 3px rgba(126, 231, 255, 0.18)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(126, 231, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(126, 231, 255, 0.08) 1px, transparent 1px)",
        radial:
          "radial-gradient(circle at top, rgba(76, 201, 240, 0.16), transparent 32%), radial-gradient(circle at 80% 20%, rgba(126, 231, 255, 0.12), transparent 24%)",
        aurora:
          "linear-gradient(135deg, rgba(126,231,255,0.22), rgba(17,34,62,0.1) 38%, rgba(76,201,240,0.08) 68%, rgba(255,255,255,0.03))",
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
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.72", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
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
