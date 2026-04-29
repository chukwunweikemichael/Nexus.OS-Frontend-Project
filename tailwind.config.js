/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',        // ← This was missing — this is the key fix
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        foreground: "#ffffff",
        card: "#111827",
        border: "#1f2937",
        primary: "#6366f1",
        accent: "#22c55e",
        secondary: "#1e293b",
        muted: "#9ca3af",
        destructive: "#ef4444",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};