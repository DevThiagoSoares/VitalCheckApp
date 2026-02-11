import { SymptomEntry } from '../../domain/entities/SymptomEntry';
import { ISymptomRepository } from '../../domain/repositories/ISymptomRepository';
import { SymptomLocalDataSource } from '../datasources/SymptomLocalDataSource';

/**
 * Implementação do repositório de sintomas.
 *
 * Conecta a interface do domínio (ISymptomRepository) ao data source
 * concreto (SymptomLocalDataSource). Segue o princípio de inversão
 * de dependência: o domínio define o contrato, e esta camada o implementa.
 *
 * Ponto de extensão: poderia adicionar cache em memória, sincronização
 * com API remota, ou estratégias de retry sem alterar o domínio.
 */
export class SymptomRepositoryImpl implements ISymptomRepository {
  constructor(private readonly localDataSource: SymptomLocalDataSource) {}

  async save(entry: SymptomEntry): Promise<void> {
    await this.localDataSource.save(entry);
  }

  async getAll(): Promise<SymptomEntry[]> {
    return this.localDataSource.getAll();
  }

  async getById(id: string): Promise<SymptomEntry | null> {
    return this.localDataSource.getById(id);
  }

  async delete(id: string): Promise<void> {
    await this.localDataSource.delete(id);
  }
}

