export interface ColorTheme {
  background: string
  hoverBackground: string
  foreground: string
  cardBackground: string
  cardForeground: string
  surfaceBackground: string
  surfaceForeground: string
  primaryBackground: string
  primaryForeground: string
  secondaryBackground: string
  secondaryForeground: string
}

export const Colors: Record<'light' | 'dark', ColorTheme> = {
  light: {
    background: '#f3f4f6',
    hoverBackground: '#9ca3af22',
    foreground: '#1f2937',
    cardBackground: '#e5e7eb',
    cardForeground: '#1f2937',
    surfaceBackground: '#f3f4f6',
    surfaceForeground: '#1f2937',
    primaryBackground: '#374151',
    primaryForeground: '#d1d5db',
    secondaryBackground: '#6b7280',
    secondaryForeground: '#e5e7eb',
  },
  dark: {
    background: '#030712',
    hoverBackground: '#f3f4f622',
    foreground: '#e5e7eb',
    cardBackground: '#1f2937',
    cardForeground: '#e5e7eb',
    surfaceBackground: '#030712',
    surfaceForeground: '#e5e7eb',
    primaryBackground: '#d1d5db',
    primaryForeground: '#1f2937',
    secondaryBackground: '#4b5563',
    secondaryForeground: '#d1d5db',
  },
}
