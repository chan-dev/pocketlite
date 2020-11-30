const defaultTheme = require('tailwindcss/defaultTheme');

const sepiaColorPalette = {
  50: '#FFFEFD',
  100: '#FEFDFC',
  200: '#FDFBF7',
  300: '#FBF8F1',
  400: '#F8F2E7',
  500: '#F5EDDD',
  600: '#DDD5C7',
  700: '#938E85',
  800: '#6E6B63',
  900: '#4A4742',
};

module.exports = {
  corePlugins: {
    float: false,
  },
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
        theme: {
          primary: 'var(--primary)',
          'primary-darker': 'var(--primary-darker)',
          secondary: 'var(--secondary)',
          accent1: 'var(--accent1)',
          'accent1-darker': 'var(--accent1-darker)',
          accent2: 'var(--accent2)',
          'accent2-darker': 'var(--accent2-darker)',

          /* Typography */
          'font-text': 'var(--font-text)',

          /* Forms */
          'input-bg': 'var(--input-bg)',
          'input-placeholder': 'var(--input-placeholder)',

          /* Sidenav */
          'sidenav-bg': 'var(--sidenav-bg)',
          'sidenav-text': 'var(--sidenav-text)',
          'sidenav-text-not-active-hover':
            'var(--sidenav-text-not-active-hover)',
          'sidenav-text-active': 'var(--sidenav-text-active)',
          'sidenav-text-bg-active': 'var(--sidenav-text-bg-active)',

          /* Icons */
          icon: 'var(--icon)',
          'icon-hover': 'var(--icon-hover)',

          /* Modals */
          'modal-bg': 'var(--modal-bg)',

          /* Tags */
          'tag-bg-active': 'var(--tag-bg-active)',
          tag: 'var(--font-text)',
          'tag-text-active': 'var(--tag-text-active)',

          'tag-chip-bg': 'var(--tag-chip-bg)',
          'tag-chip-bg-hover': 'var(--tag-chip-bg-hover)',
          'tag-chip-text': 'var(--tag-chip-text)'
        },
        sepia: {
          ...sepiaColorPalette,
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
    backgroundOpacity: ({ after }) => after(['dark', 'dark-hover']),
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
