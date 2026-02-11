/**
 * Entidade que representa uma leitura de sinais vitais.
 *
 * Imutável por design — cada leitura é um snapshot no tempo.
 * Os campos são readonly para garantir imutabilidade em nível de tipo.
 */
export interface VitalSign {
  readonly heartRate: number; // bpm
  readonly steps: number;
  readonly timestamp: Date;
}

/**
 * Factory function para criação de VitalSign com validação.
 * Centraliza a lógica de criação e garante invariantes do domínio.
 */
export function createVitalSign(
  heartRate: number,
  steps: number,
  timestamp: Date = new Date()
): VitalSign {
  if (heartRate < 0 || heartRate > 300) {
    throw new Error(`Frequência cardíaca inválida: ${heartRate}. Deve estar entre 0 e 300 bpm.`);
  }

  if (steps < 0) {
    throw new Error(`Contagem de passos inválida: ${steps}. Não pode ser negativa.`);
  }

  return Object.freeze({ heartRate, steps, timestamp });
}

