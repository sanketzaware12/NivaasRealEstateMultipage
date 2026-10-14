/* Tailwind Play CDN configuration.
   Loaded AFTER the Tailwind CDN script. Edit brand colours and fonts here.
   Palette matches the dark editorial theme in css/style.css. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: '#F4EFE6',
        mist: '#0F1115',
        lichen: '#272A2F',
        pine: {
          DEFAULT: '#C8A66B',
          dark: '#08090B',
          light: '#E0C28C'
        },
        brass: {
          DEFAULT: '#D9B779',
          deep: '#B38A4D'
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  }
};
