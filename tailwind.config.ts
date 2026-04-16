import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        scn: {
          gold: "#b99a64",
          charcoal: "#1f1f1f",
          soft: "#f7f4ef",
        },
      },
      boxShadow: {
        soft: "0 20px 50px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
