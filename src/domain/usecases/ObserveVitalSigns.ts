import { VitalSign } from '../entities/VitalSign';
import { IVitalSignProvider } from '../repositories/IVitalSignProvider';

/**
 * Use Case: Observar sinais vitais em tempo real.
 *
 * Encapsula a regra de negócio de monitoramento de sinais vitais.
 * Atualmente delega diretamente ao provider, mas serve como ponto
 * de extensão para lógica adicional no futuro (ex: alertas quando
 * frequência cardíaca ultrapassar limites, agregação de dados, etc.).
 */
export class ObserveVitalSigns {
  constructor(private readonly provider: IVitalSignProvider) {}

  /**
   * Inicia a observação de sinais vitais.
   *
   * @param onData - Callback invocado com cada nova leitura
   * @returns Função de cleanup para interromper a observação
   */
  execute(onData: (vitalSign: VitalSign) => void): () => void {
    return this.provider.subscribe(onData);
  }

  /**
   * Retorna a última leitura conhecida.
   */
  getLatest(): VitalSign | null {
    return this.provider.getLatest();
  }
}

