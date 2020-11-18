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
    }
  },
  variants: {
    display: ({ after }) => after(['group-hover']),
    borderColor: ({ after }) => after([
      'focus-within',
      'dark', 'dark-focus', 'dark-focus-within',
      'sepia', 'sepia-focus', 'sepia-focus-within'
    ]),
    backgroundColor: ({ after }) => after([
      'disabled',
      'dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd',
      'sepia', 'sepia-hover', 'sepia-group-hover', 'sepia-even', 'sepia-odd'
    ]),
    textColor: [
      'dark', 'dark-hover', 'dark-active', 'dark-placeholder',
      'sepia', 'sepia-hover', 'sepia-active', 'sepia-placeholder'
    ]
  },
  plugins: [
    require('tailwindcss-truncate-multiline')(),
    require('tailwindcss-dark-mode')(),
    require('tailwindcss-sepia-mode')()
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
