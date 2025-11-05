/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",    // App router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",  // Pages router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00B8D9",
        secondary: "#14F7FF",
        background: "#0D1117",
        surface: "#1E1E2E",
        body: "#E0E0E0",
        muted: "#9E9E9E",
        accent: "#FF3366",
        glow: "#0FF0FC",
      },
    },
  },
  plugins: [],
};
