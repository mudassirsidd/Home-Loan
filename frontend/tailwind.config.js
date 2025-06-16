module.exports = {
  darkMode: 'class',  // 'media' bhi ho sakta hai, lekin 'class' zyada control deta hai
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        scan: 'scan 2s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-in-out forwards',
      },
      keyframes: {
        scan: {
          '0%': { top: '-100%' },
          '100%': { top: '100%' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(15px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
