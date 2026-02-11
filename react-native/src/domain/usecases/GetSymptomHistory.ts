import { SymptomEntry } from '../entities/SymptomEntry';
import { ISymptomRepository } from '../repositories/ISymptomRepository';

/**
 * Use Case: Obter histórico de sintomas registrados.
 *
 * Encapsula a recuperação do histórico de sintomas.
 * Ponto de extensão para filtros, paginação ou transformações futuras.
 */
export class GetSymptomHistory {
  constructor(private readonly repository: ISymptomRepository) {}

  /**
   * Retorna todos os registros de sintomas ordenados por data.
   */
  async execute(): Promise<SymptomEntry[]> {
    return this.repository.getAll();
  }
}

