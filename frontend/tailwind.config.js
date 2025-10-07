export default {
  darkMode: 'class',
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors:{
        'primary': "#5f6FFF"
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [],
};