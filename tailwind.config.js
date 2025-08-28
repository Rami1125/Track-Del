// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // נתיבים לקבצים המכילים קלאסי Tailwind
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html", // ודא שגם קובץ ה-HTML הציבורי נכלל
  ],
  theme: {
    extend: {
      // כאן ניתן להרחיב את ערכי העיצוב של Tailwind
      colors: {
        'primary-blue': '#2563eb',
        'secondary-green': '#10B981',
      },
      fontFamily: {
        // הגדרת פונטים מותאמים אישית
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
