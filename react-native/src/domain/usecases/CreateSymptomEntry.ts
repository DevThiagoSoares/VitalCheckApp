import { SymptomEntry, createSymptomEntry } from '../entities/SymptomEntry';
import { ISymptomRepository } from '../repositories/ISymptomRepository';

/**
 * Use Case: Criar um novo registro de sintoma.
 *
 * Coordena a criação da entidade com validação de domínio
 * e sua persistência através do repositório.
 *
 * O ID é gerado externamente (injetado via factory) para manter
 * testabilidade e separação de responsabilidades.
 */
export class CreateSymptomEntry {
  constructor(
    private readonly repository: ISymptomRepository,
    private readonly generateId: () => string
  ) {}

  /**
   * Cria e persiste um novo registro de sintoma.
   *
   * @param description - Descrição textual do sintoma
   * @returns O registro criado
   * @throws Error se a descrição for inválida ou a persistência falhar
   */
  async execute(description: string): Promise<SymptomEntry> {
    const id = this.generateId();
    const entry = createSymptomEntry(id, description, new Date());

    await this.repository.save(entry);

    return entry;
  }
}

