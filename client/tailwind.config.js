const defaultTheme = require('tailwindcss/defaultTheme');

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
        72: '18rem',
        80: '20rem',
        96: '24rem',
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
      colors: {
        // list ONLY the shared by multiple ui components
        'dark-mode': {
          default: '#1a1a1a',
          max: defaultTheme.colors.black,
          text: defaultTheme.colors.gray[300],
          border: defaultTheme.colors.black
        }
      },
      opacity: {
        10: '0.10',
      },
    },
  },
  variants: {
    display: ({ after }) => after(['group-hover']),
    borderColor: ({ after }) =>
      after([
        'focus-within',
        'dark',
        'dark-focus',
        'dark-focus-within',
        'sepia',
        'sepia-focus',
        'sepia-focus-within',
      ]),
    backgroundColor: ({ after }) =>
      after([
        'disabled',
        'dark',
        'dark-hover',
        'dark-active',
        'dark-group-hover',
        'dark-even',
        'dark-odd',
        'sepia',
        'sepia-hover',
        'sepia-active',
        'sepia-group-hover',
        'sepia-even',
        'sepia-odd',
      ]),
    textColor: ({ after }) =>
      after([
        'dark',
        'dark-hover',
        'dark-active',
        'dark-placeholder',
        'sepia',
        'sepia-hover',
        'sepia-active',
        'sepia-placeholder',
      ]),
    backgroundOpacity: ({ after }) => after(['dark', 'dark-hover'])
  },
  plugins: [
    require('tailwindcss-truncate-multiline')(),
    require('tailwindcss-dark-mode')(),
    require('tailwindcss-sepia-mode')(),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
