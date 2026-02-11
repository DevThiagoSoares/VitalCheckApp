import { VitalSign } from '../../domain/entities/VitalSign';
import { IVitalSignProvider } from '../../domain/repositories/IVitalSignProvider';

/**
 * Implementação do repositório de sinais vitais.
 *
 * Atua como adaptador entre a interface do domínio (IVitalSignProvider)
 * e a fonte de dados concreta (datasource). Segue o padrão Repository
 * da Clean Architecture, onde esta classe vive na camada Data e
 * implementa a interface definida na camada Domain.
 *
 * Na arquitetura atual, delega diretamente ao datasource. Em cenários
 * mais complexos, poderia agregar múltiplas fontes (cache, rede, sensor).
 */
export class VitalSignRepositoryImpl implements IVitalSignProvider {
  constructor(private readonly dataSource: IVitalSignProvider) {}

  subscribe(onData: (vitalSign: VitalSign) => void): () => void {
    return this.dataSource.subscribe(onData);
  }

  getLatest(): VitalSign | null {
    return this.dataSource.getLatest();
  }
}

