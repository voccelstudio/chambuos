/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./assets/js/app.js"],
  theme: {
    extend: {
      colors: {
        "surface-container": "#201f1f",
        "on-surface-variant": "#ccc6ba",
        "on-secondary-fixed": "#410007",
        "on-secondary": "#660412",
        "secondary-fixed-dim": "#ffb3b0",
        tertiary: "#ffffff",
        "inverse-on-surface": "#313030",
        "primary-fixed": "#ece2c9",
        "surface-container-lowest": "#0e0e0e",
        "tertiary-fixed-dim": "#a2d582",
        "surface-container-low": "#1c1b1b",
        surface: "#131313",
        "on-tertiary-fixed-variant": "#26500d",
        "on-primary": "#35301f",
        "surface-bright": "#393939",
        "on-primary-fixed": "#201b0c",
        "on-error": "#690005",
        "on-tertiary-container": "#436f2a",
        "on-secondary-fixed-variant": "#861f25",
        background: "#131313",
        "secondary-fixed": "#ffdad8",
        "surface-container-highest": "#353534",
        "on-primary-container": "#6b6450",
        "error-container": "#93000a",
        primary: "#ffffff",
        outline: "#959086",
        "on-primary-fixed-variant": "#4c4634",
        "on-error-container": "#ffdad6",
        "primary-container": "#ece2c9",
        "on-surface": "#e5e2e1",
        "on-tertiary": "#133800",
        "surface-tint": "#cfc6ae",
        "inverse-surface": "#e5e2e1",
        secondary: "#ffb3b0",
        "tertiary-container": "#bdf19c",
        "outline-variant": "#4a463e",
        "on-tertiary-fixed": "#082100",
        "secondary-container": "#8a2227",
        "inverse-primary": "#645e4b",
        "on-secondary-container": "#ff9e9b",
        "primary-fixed-dim": "#cfc6ae",
        error: "#ffb4ab",
        "surface-dim": "#131313",
        "on-background": "#e5e2e1",
        "surface-variant": "#353534",
        "tertiary-fixed": "#bdf19c",
        "surface-container-high": "#2a2a2a"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        gutter: "24px",
        base: "8px",
        "touch-target": "48px"
      },
      fontFamily: {
        "body-md": ["Hanken Grotesk"],
        "body-lg": ["Hanken Grotesk"],
        "headline-md": ["Libre Caslon Text"],
        "title-lg": ["Hanken Grotesk"],
        "display-lg": ["Libre Caslon Text"],
        "label-md": ["Hanken Grotesk"],
        "headline-lg": ["Libre Caslon Text"],
        "label-sm": ["Hanken Grotesk"],
        "headline-lg-mobile": ["Libre Caslon Text"]
      },
      fontSize: {
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "400" }],
        "title-lg": ["20px", { lineHeight: "28px", letterSpacing: "0.05em", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "400" }],
        "label-sm": ["10px", { lineHeight: "14px", letterSpacing: "0.08em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "400" }]
      }
    }
  }
};