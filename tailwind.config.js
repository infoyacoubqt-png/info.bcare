/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Tajawal"', '"Cairo"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6f0f5',
          100: '#cce0eb',
          200: '#99c1d7',
          300: '#66a2c3',
          400: '#3383af',
          500: '#136494',
          600: '#115884',
          700: '#0e476b',
          800: '#0a3550',
          900: '#072438',
        },
        accent: {
          50: '#fef5e7',
          100: '#fdebcf',
          200: '#fbd79f',
          300: '#f9c46f',
          400: '#f9b04a',
          500: '#f9a52d',
          600: '#e08e1a',
          700: '#b87415',
          800: '#915c11',
          900: '#6b440d',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
    },
  },
  plugins: [],
}
