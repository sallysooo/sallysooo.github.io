import { register } from 'react-social-icons';

// react-social-icons has no Google Scholar or ORCID icon, so register them in
// its format: the 64x64 square followed by the glyph, which the component
// cuts out of the circle. Glyphs are the CC0 simple-icons
// (https://simpleicons.org) logos, scaled from 24x24 to the library's ~32-unit
// centred glyph size.

register('googlescholar', {
  color: '#4285f4',
  path: 'M0 0v64h64V0zM22.99 34.36L16 28.67 32 16l16 12.67-6.99 5.69C39.4 31 35.97 28.67 32 28.67c-3.97 0-7.4 2.33-9.01 5.69zM32 29.33a9.33 9.33 0 1 0 0 18.67 9.33 9.33 0 0 0 0-18.67z',
});

register('orcid', {
  color: '#a6ce39',
  path: 'M0 0v64h64V0zM32 16C23.16 16 16 23.16 16 32s7.16 16 16 16 16-7.16 16-16S40.84 16 32 16zM25.83 21.84c0.7 0 1.26 0.57 1.26 1.26s-0.56 1.26-1.26 1.26a1.27 1.27 0 0 1-1.27-1.26c0-0.7 0.56-1.26 1.27-1.26z m-0.97 4.05h1.93v13.39H24.86V25.89z m4.75 0h5.2c4.95 0 7.13 3.54 7.13 6.7 0 3.44-2.69 6.7-7.1 6.7h-5.23V25.89z m1.93 1.74v9.92h3.06c4.36 0 5.36-3.31 5.36-4.96 0-2.69-1.71-4.96-5.46-4.96h-2.96z',
});
