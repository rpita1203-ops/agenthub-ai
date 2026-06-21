import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          bg: "#030014",
          card: "rgba(10, 8, 28, 0.7)",
          border: "rgba(123, 97, 255, 0.15)",
          borderHover: "rgba(123, 97, 255, 0.4)",
          purple: "#7b61ff",
          blue: "#00f0ff",
          pink: "#ff007a",
          gold: "#ffaa00",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(rgba(123, 97, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 97, 255, 0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-purple": "0 0 15px rgba(123, 97, 255, 0.3)",
        "glow-blue": "0 0 15px rgba(0, 240, 255, 0.3)",
        "glow-pink": "0 0 15px rgba(255, 0, 122, 0.3)",
        "glow-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "border-glow": "borderGlow 4s linear infinite",
        "text-glow": "textGlow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.02)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(123, 97, 255, 0.2)" },
          "50%": { borderColor: "rgba(0, 240, 255, 0.6)" },
        },
        textGlow: {
          "0%, 100%": { textShadow: "0 0 10px rgba(123, 97, 255, 0.5)" },
          "50%": { textShadow: "0 0 20px rgba(0, 240, 255, 0.8), 0 0 5px rgba(123, 97, 255, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
