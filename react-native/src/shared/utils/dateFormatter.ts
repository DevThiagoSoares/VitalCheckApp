/**
 * Utilitários de formatação de data.
 *
 * Utiliza Intl.DateTimeFormat nativo ao invés de bibliotecas como date-fns ou moment.
 * Justificativa:
 * - Reduz bundle size
 * - O suporte a Intl é excelente em React Native (Hermes engine)
 * - Para as necessidades atuais do app, não há ganho em adicionar uma dependência externa
 */

/**
 * Formata data no padrão brasileiro: "10/02/2026 às 14:30"
 */
export function formatDateTime(date: Date): string {
  const dateStr = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateStr} às ${timeStr}`;
}

/**
 * Formata data de forma relativa e legível: "Hoje", "Ontem", ou data completa.
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'Agora mesmo';
  if (diffMinutes < 60) return `Há ${diffMinutes} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;

  return formatDateTime(date);
}

