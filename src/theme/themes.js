// Bento, dark-first palette: a neutral page/surface ramp + a single pastel
// accent (with a milkier partner used only for gradients). Existing keys are
// preserved so every component keeps working; values are retuned for the look.

// Accent palettes — switch the whole site's point colour by changing ACCENT.
// In light mode the text-level accent is deeper so links stay readable on the
// light background; fills (buttons, accent tiles) keep the pastel gradient.
const ACCENTS = {
  // The site's original indigo/violet look.
  grape: {
    light: {
      accentColor: '#4f46e5',
      accentColor2: '#7c3aed',
      gradientStart: '#4f46e5',
      onAccent: '#fff',
      accentSoft: 'rgba(79, 70, 229, 0.12)',
      glow1: 'rgba(79, 70, 229, 0.10)',
      glow2: 'rgba(124, 58, 237, 0.08)',
    },
    dark: {
      accentColor: '#818cf8',
      accentColor2: '#c084fc',
      gradientStart: '#818cf8',
      onAccent: '#fff',
      accentSoft: 'rgba(129, 140, 248, 0.14)',
      glow1: 'rgba(99, 102, 241, 0.18)',
      glow2: 'rgba(168, 85, 247, 0.12)',
    },
  },
  strawberry: {
    light: {
      accentColor: '#ad4566',
      accentColor2: '#fdb8c8',
      gradientStart: '#ec8ca8',
      onAccent: '#4a1d2b',
      accentSoft: 'rgba(236, 140, 168, 0.18)',
      glow1: 'rgba(236, 140, 168, 0.16)',
      glow2: 'rgba(253, 184, 200, 0.14)',
    },
    dark: {
      accentColor: '#f294ae',
      accentColor2: '#fdb8c8',
      gradientStart: '#f294ae',
      onAccent: '#4a1d2b',
      accentSoft: 'rgba(242, 148, 174, 0.15)',
      glow1: 'rgba(242, 148, 174, 0.14)',
      glow2: 'rgba(253, 184, 200, 0.07)',
    },
  },
  matcha: {
    light: {
      accentColor: '#57773a',
      accentColor2: '#ddebc9',
      gradientStart: '#a8c98a',
      onAccent: '#25361a',
      accentSoft: 'rgba(168, 201, 138, 0.22)',
      glow1: 'rgba(168, 201, 138, 0.18)',
      glow2: 'rgba(221, 235, 201, 0.20)',
    },
    dark: {
      accentColor: '#b5d29a',
      accentColor2: '#ddebc9',
      gradientStart: '#b5d29a',
      onAccent: '#25361a',
      accentSoft: 'rgba(181, 210, 154, 0.14)',
      glow1: 'rgba(181, 210, 154, 0.12)',
      glow2: 'rgba(221, 235, 201, 0.06)',
    },
  },
};

const ACCENT = 'grape';

export const lightTheme = {
  isDark: false,
  background: '#f4f4f6',
  color: '#18181b',
  textMuted: '#52525b',
  ...ACCENTS[ACCENT].light,
  chronoTheme: {
    cardBgColor: '#ffffff',
    cardForeColor: '#18181b',
    titleColor: 'white',
  },
  timelineLineColor: '#e4e4e7',
  cardBackground: '#ffffff',
  cardFooterBackground: '#fafafa',
  cardBorderColor: 'rgba(0, 0, 0, 0.08)',
  navbarBackground: 'rgba(244, 244, 246, 0.72)',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
  shadowMd: '0 8px 24px rgba(0, 0, 0, 0.10), 0 16px 48px rgba(0, 0, 0, 0.12)',
  navbarTheme: {
    linkColor: '#52525b',
    linkHoverColor: '#18181b',
    linkActiveColor: '#18181b',
  },
  bsPrimaryVariant: 'light',
  bsSecondaryVariant: 'dark',
  socialIconBgColor: '#18181b',
};

export const darkTheme = {
  isDark: true,
  background: '#09090b',
  color: '#f4f4f5',
  textMuted: '#a1a1aa',
  ...ACCENTS[ACCENT].dark,
  chronoTheme: {
    cardBgColor: '#141417',
    cardForeColor: '#f4f4f5',
    titleColor: 'black',
  },
  timelineLineColor: '#27272a',
  cardBackground: '#141417',
  cardFooterBackground: '#1b1b1f',
  cardBorderColor: 'rgba(255, 255, 255, 0.08)',
  navbarBackground: 'rgba(9, 9, 11, 0.62)',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.40), 0 4px 16px rgba(0, 0, 0, 0.40)',
  shadowMd: '0 8px 24px rgba(0, 0, 0, 0.55), 0 16px 48px rgba(0, 0, 0, 0.60)',
  navbarTheme: {
    linkColor: '#a1a1aa',
    linkHoverColor: '#fafafa',
    linkActiveColor: '#fafafa',
  },
  bsPrimaryVariant: 'dark',
  bsSecondaryVariant: 'light',
  socialIconBgColor: '#f4f4f5',
};
