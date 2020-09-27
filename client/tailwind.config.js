module.exports = {
  important: true,
  purge: [],
  theme: {
    truncate: {
      lines: {
        2: '2',
        3: '3',
        5: '5',
        8: '8',
      },
    },
    extend: {},
  },
  variants: {
    display: ['responsive', 'hover', 'focus', 'group-hover'],
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
  },
  plugins: [require('tailwindcss-truncate-multiline')()],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
