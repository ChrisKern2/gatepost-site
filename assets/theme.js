/* ===========================================================================
   BRAND THEME: colors and fonts
   ---------------------------------------------------------------------------
   Change a hex value here and it updates everywhere on the site, including
   components.css (the values are mirrored into CSS variables automatically).

   The scale runs light (50) to dark (900). In the HTML you refer to them as
   `bg-stone-100`, `text-moss-900`, `text-brass-700`, and so on.

     moss   = deep institutional green. Dark sections, headings, primary button.
     brass  = the accent, taken from gate hardware. Labels, rules, small marks.
     stone  = warm neutral. Page grounds and all body text.
   =========================================================================== */

const palette = {
  moss: {
    50:  '#F1F6F3',
    100: '#E2EAE5',
    200: '#C6D5CC',
    300: '#9AB2A5',
    400: '#6B897B',
    500: '#47695A',
    600: '#365446',
    700: '#294036',
    800: '#1E2E25',
    900: '#16211B'
  },
  brass: {
    50:  '#FAF6EC',
    100: '#F4EDDB',
    200: '#E9DDBE',
    300: '#D9C591',
    400: '#C4A85F',
    500: '#B08F3C',
    600: '#96742C',
    700: '#7A5C21'
  },
  stone: {
    50:  '#FCFBF7',
    100: '#F6F3EA',
    200: '#EDE8DA',
    300: '#DED7C4',
    400: '#B9B3A2',
    500: '#8A857A',
    600: '#625E56',
    700: '#45423C',
    800: '#2E2C28',
    900: '#1C1B18'
  }
};

/* --- Tailwind configuration ---------------------------------------------- */

tailwind.config = {
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        // Headlines. A slab serif: sturdy, industrial, the lettering you see on
        // equipment and county paperwork. Rockwell is the Windows fallback, so the
        // factsheet in PowerPoint lands in the same register with no install.
        serif: ['Bitter', 'Rockwell', 'Georgia', 'serif'],
        // Everything else.
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
      },
      letterSpacing: { tightest: '-0.028em' },
      maxWidth: { '8xl': '84rem' },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,24,0.05)',
        lift: '0 2px 6px rgba(28,27,24,0.06), 0 14px 30px -16px rgba(28,27,24,0.18)'
      }
    }
  }
};

/* --- mirror the palette into CSS variables ------------------------------- *
   This is what lets components.css say `var(--brass-600)` and stay in sync
   with the colors above. You should not need to touch this part.            */

(function mirrorPaletteToCss() {
  const root = document.documentElement.style;
  for (const [family, shades] of Object.entries(palette)) {
    for (const [step, hex] of Object.entries(shades)) {
      root.setProperty(`--${family}-${step}`, hex);
    }
  }
})();
