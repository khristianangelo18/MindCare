/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#5ad0be',
          500: '#38beaa',
          600: '#1aa592',
          700: '#158374',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
