/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '400px',
      md: '600px',
      lg: '1030px',
      xl: '1340px',
      '2xl': '1700px',
      '3xl': '2100px',
    },
  },
};
