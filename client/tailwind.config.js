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
    extend: {
      spacing: {
        '1/4': '25%',
        '3/4': '75%',
      },
      inset: {
        '1/2': '50%',
        '1/4': '25%',
        '3/4': '75%',
        '-1/2': '-50%',
        '-1/4': '-25%',
        '-3/4': '-75%',
      },
    },
  },
  variants: {
    display: ['responsive', 'hover', 'focus', 'group-hover'],
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled'],
  },
  plugins: [require('tailwindcss-truncate-multiline')()],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
