import { SymptomEntry } from '../entities/SymptomEntry';

/**
 * Interface (porta) para persistência de registros de sintomas.
 *
 * Define o contrato que qualquer implementação de armazenamento
 * deve seguir. A camada de domínio depende apenas desta abstração,
 * nunca de detalhes de persistência (AsyncStorage, SQLite, API, etc.).
 */
export interface ISymptomRepository {
  /**
   * Persiste um novo registro de sintoma.
   * @throws Error se a persistência falhar
   */
  save(entry: SymptomEntry): Promise<void>;

  /**
   * Retorna todos os registros de sintomas, ordenados por timestamp decrescente.
   */
  getAll(): Promise<SymptomEntry[]>;

  /**
   * Busca um registro específico pelo ID.
   * @returns O registro encontrado ou null se não existir
   */
  getById(id: string): Promise<SymptomEntry | null>;

  /**
   * Remove um registro de sintoma pelo ID.
   * @throws Error se o registro não existir ou a remoção falhar
   */
  delete(id: string): Promise<void>;
}

