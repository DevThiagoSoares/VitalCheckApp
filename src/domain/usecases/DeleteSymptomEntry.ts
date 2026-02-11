import { ISymptomRepository } from '../repositories/ISymptomRepository';

/**
 * Use Case: Remover um registro de sintoma.
 *
 * Permite ao usuário excluir registros de sintomas do histórico.
 */
export class DeleteSymptomEntry {
  constructor(private readonly repository: ISymptomRepository) {}

  /**
   * Remove um registro de sintoma pelo ID.
   *
   * @param id - Identificador do registro a ser removido
   * @throws Error se o registro não existir
   */
  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID do sintoma é obrigatório para exclusão.');
    }

    await this.repository.delete(id);
  }
}

