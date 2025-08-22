import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px", // Small mobile
      sm: "425px", // Large mobile
      md: "768px", // Tablet
      lg: "1024px", // Small desktop
      xl: "1280px", // Large desktop
      "2xl": "1536px", // Extra large desktop
    },
    extend: {
      fontFamily: {
        title: ["var(--font-fredoka)", "system-ui", "sans-serif"],
        content: ["var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"], // Default font
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      colors: {
        hypeya: {
          50: "#f4f0ff",
          100: "#ebe4ff",
          200: "#d9ccff",
          300: "#bfa5ff",
          400: "#a074ff",
          500: "#8441ff",
          600: "#6a40f2", // Main brand color
          700: "#5d2be8",
          800: "#4e23c4",
          900: "#421ea1",
          950: "#281170",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
