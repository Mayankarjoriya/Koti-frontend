// Single source of truth for design tokens that can't live in CSS alone
// (e.g. colors passed into R3F materials, GSAP tweens, or JS-driven canvas
// work). Tailwind pulls the same values via CSS custom properties in
// app/globals.css — keep both in sync if this ever changes.
export const theme = {
  colors: {
    background: '#0B0D10',
    surface: '#14171B',
    accent: '#F2A93B', // signal-amber — interactive/highlight states only, never decorative fills
    graphite: '#4B5563',
    textPrimary: '#F5F5F4',
    textMuted: '#9CA3AF',
  },
  font: {
    display: 'var(--font-display)', // labels, numerals, hero headline only
    body: 'var(--font-sans)', // paragraph copy
  },
  motion: {
    // Respect prefers-reduced-motion everywhere this is consumed.
    heroDuration: 1.2,
    revealDuration: 0.8,
    hoverEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
} as const

export type Theme = typeof theme
