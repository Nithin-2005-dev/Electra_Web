/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Pages router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00E5FF",
        secondary: "#0077FF",
        background: "#0A0A0A",
        surface: "#121212",
        body: "#E6E6E6",
        muted: "#A0A0A0",
        accent: "#00E5FF",
        glow: "#00E5FF",
      },
    },
  },
  plugins: [],
};
