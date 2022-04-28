const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.js',
    './plugins/**/*.ts',
    './nuxt.config.js',
    './nuxt.config.ts',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      sky: colors.sky,
      fuchsia: colors.fuchsia,
    },
    extend: {},
  },
  plugins: [],
};
