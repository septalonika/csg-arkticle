/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./**/*.html", "./src/pages/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#44576d",
        secondary: "#ffffff",
        third: "#292929",
        "dark-primary": "#27374D",
        "dark-secondary": "#44576d",
        "dark-accent": "#9DB2BF",
        "dark-neutral": "#616161",
        sky: "#aac7d8",
        neutral: "#768a96",
        accent: "#d2dce6",
        active: "#efece9",
        info: "#dfebf6",
        success: "#109347",
        warning: "#fcc764",
        error: "#f75e5e",
        "placeholder-text": "#e6e6e6",
        "company-primary": "#44576d",
        "company-accent": "#86373e",
        "dark-company-accent": "#dd3947",
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
