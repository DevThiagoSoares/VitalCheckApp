/**
 * Entidade que representa um registro de sintoma no diário de saúde.
 *
 * Imutável por design — entradas de diário não devem ser alteradas após criação.
 * O `id` é gerado externamente para manter a entidade pura (sem dependência de geração de IDs).
 */
export interface SymptomEntry {
  readonly id: string;
  readonly description: string;
  readonly timestamp: Date;
}

/**
 * Factory function para criação de SymptomEntry com validação de domínio.
 */
export function createSymptomEntry(
  id: string,
  description: string,
  timestamp: Date = new Date()
): SymptomEntry {
  const trimmedDescription = description.trim();

  if (!trimmedDescription) {
    throw new Error('A descrição do sintoma não pode ser vazia.');
  }

  if (trimmedDescription.length > 500) {
    throw new Error('A descrição do sintoma não pode exceder 500 caracteres.');
  }

  if (!id) {
    throw new Error('O ID do sintoma não pode ser vazio.');
  }

  return Object.freeze({ id, description: trimmedDescription, timestamp });
}

