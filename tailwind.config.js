/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3ddc97',
          600: '#232946',
          700: '#181c24',
          800: '#3a506b',
          900: '#eebbc3'
        },
        dark: {
          bg: '#181c24',
          card: '#232946',
          text: '#e0e6ed'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}