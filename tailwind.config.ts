import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-primary": "#1000a9",
        "on-tertiary-fixed-variant": "#00513d",
        "on-tertiary-container": "#003024",
        "on-secondary-container": "#00424e",
        surface: "#0f131c",
        outline: "#908fa0",
        "on-error-container": "#ffdad6",
        "primary-fixed-dim": "#c0c1ff",
        "surface-variant": "#31353e",
        "on-tertiary-fixed": "#002117",
        "surface-container-highest": "#31353e",
        "surface-tint": "#c0c1ff",
        "on-background": "#dfe2ee",
        "secondary-fixed": "#acedff",
        "on-secondary": "#003640",
        primary: "#c0c1ff",
        "surface-container-high": "#262a33",
        "inverse-primary": "#494bd6",
        background: "#0f131c",
        "secondary-fixed-dim": "#4cd7f6",
        "on-secondary-fixed-variant": "#004e5c",
        "on-primary-fixed-variant": "#2f2ebe",
        "surface-container-lowest": "#0a0e16",
        "surface-bright": "#353942",
        "surface-container-low": "#181c24",
        "secondary-container": "#03b5d3",
        secondary: "#4cd7f6",
        "on-error": "#690005",
        "tertiary-fixed-dim": "#61dbb4",
        "on-tertiary": "#00382a",
        "primary-fixed": "#e1e0ff",
        "tertiary-container": "#12a480",
        "on-primary-container": "#0d0096",
        "outline-variant": "#464554",
        "inverse-on-surface": "#2c3039",
        "tertiary-fixed": "#7ff8cf",
        "surface-dim": "#0f131c",
        "surface-container": "#1c2028",
        error: "#ffb4ab",
        "inverse-surface": "#dfe2ee",
        tertiary: "#61dbb4",
        "on-surface-variant": "#c7c4d7",
        "on-secondary-fixed": "#001f26",
        "on-surface": "#dfe2ee",
        "error-container": "#93000a",
        "primary-container": "#8083ff",
        "on-primary-fixed": "#07006c",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        gutter: "1rem",
        "space-xl": "1.5rem",
        "margin-md": "1.5rem",
        "space-3xl": "3rem",
        "gutter-lg": "1.5rem",
        "space-2xl": "2rem",
        "space-sm": "0.5rem",
        "margin-lg": "2rem",
        "space-lg": "1rem",
        "space-xs": "0.25rem",
        "space-md": "0.75rem",
        margin: "1rem",
      },
      fontFamily: {
        "plus-jakarta": ["var(--font-plus-jakarta)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.03em",
            fontWeight: "700",
          },
        ],
        "display-xl-mobile": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.025em",
            fontWeight: "600",
          },
        ],
        "headline-lg-mobile": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.015em",
            fontWeight: "600",
          },
        ],
        "headline-md": [
          "20px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.015em",
            fontWeight: "600",
          },
        ],
        "headline-sm": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-lg": [
          "16px",
          {
            lineHeight: "26px",
            letterSpacing: "-0.005em",
            fontWeight: "400",
          },
        ],
        "body-md": [
          "14px",
          {
            lineHeight: "22px",
            letterSpacing: "0em",
            fontWeight: "400",
          },
        ],
        "body-sm": [
          "13px",
          {
            lineHeight: "18px",
            letterSpacing: "0.005em",
            fontWeight: "400",
          },
        ],
        "label-md": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "0.01em",
            fontWeight: "500",
          },
        ],
        "label-xs": [
          "11px",
          {
            lineHeight: "14px",
            letterSpacing: "0.04em",
            fontWeight: "600",
          },
        ],
        "code-sm": [
          "13px",
          {
            lineHeight: "20px",
            letterSpacing: "0em",
            fontWeight: "400",
          },
        ],
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "ping-slow": "ping 2s cubic-bezier(0,0,0.2,1) infinite",
      },
      boxShadow: {
        card: "0 1px 8px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 24px rgba(0,0,0,0.12)",
        xl: "0 8px 32px rgba(0,0,0,0.2)",
      },
      backdropBlur: {
        xl: "24px",
        "2xl": "40px",
      },
    },
  },
  plugins: [],
};

export default config;
