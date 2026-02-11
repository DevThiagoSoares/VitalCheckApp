import { VitalSign } from '../entities/VitalSign';

/**
 * Interface (porta) para provedores de sinais vitais.
 *
 * Abstrai a fonte de dados de sinais vitais — pode ser um sensor real,
 * uma API externa ou um simulador. A camada de domínio não conhece
 * a implementação concreta.
 *
 * Utiliza um padrão de callback-based subscription ao invés de
 * dependências de bibliotecas reativas, mantendo o domínio puro.
 */
export interface IVitalSignProvider {
  /**
   * Inicia a observação de sinais vitais.
   * O callback é invocado sempre que novos dados estão disponíveis.
   *
   * @param onData - Callback chamado com cada nova leitura de sinais vitais
   * @returns Função de cleanup para parar a observação
   */
  subscribe(onData: (vitalSign: VitalSign) => void): () => void;

  /**
   * Retorna a última leitura disponível, se existir.
   */
  getLatest(): VitalSign | null;
}

