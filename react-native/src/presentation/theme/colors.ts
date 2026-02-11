/**
 * Paleta de cores centralizada do VitalCheck App.
 *
 * Centralizar cores em um único arquivo:
 * - Facilita manutenção e consistência visual
 * - Permite futura implementação de dark mode
 * - Evita valores mágicos espalhados pelo código
 */
export const Colors = {
  // Primárias
  primary: '#4A90D9',
  primaryDark: '#357ABD',
  primaryLight: '#7FB3E6',

  // Semânticas (saúde)
  heartRate: '#E74C3C',
  heartRateLight: '#FDEDEC',
  steps: '#27AE60',
  stepsLight: '#EAFAF1',

  // Neutras
  background: '#F5F7FA',
  surface: '#FFFFFF',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textTertiary: '#BDC3C7',

  // Feedback
  error: '#E74C3C',
  errorLight: '#FDEDEC',
  success: '#27AE60',
  warning: '#F39C12',

  // Bordas e divisores
  border: '#E8ECF0',
  divider: '#F0F2F5',

  // Sombra
  shadow: '#000000',
} as const;

