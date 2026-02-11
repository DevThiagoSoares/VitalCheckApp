import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymptomEntry } from '../../domain/entities/SymptomEntry';

/**
 * DTO para serialização/deserialização de SymptomEntry no AsyncStorage.
 *
 * Necessário porque Date não é serializável diretamente em JSON.
 * Separa o formato de persistência da entidade de domínio.
 */
interface SymptomEntryDTO {
  id: string;
  description: string;
  timestamp: string; // ISO 8601
}

const STORAGE_KEY = '@vital_check/symptoms';

/**
 * Data Source local para registros de sintomas utilizando AsyncStorage.
 *
 * Escolha do AsyncStorage:
 * - Adequado para dados textuais com volume moderado (diário de sintomas)
 * - API simples e bem suportada no ecossistema Expo/RN
 * - Para volumes maiores, poderia ser substituído por SQLite (expo-sqlite)
 *   sem impactar camadas superiores
 *
 * Limitações conhecidas:
 * - AsyncStorage armazena tudo como string (necessita serialização JSON)
 * - Não suporta queries complexas (filtragem é feita em memória)
 * - Para produção com alto volume, SQLite seria preferível
 *
 * A abstração via ISymptomRepository permite essa troca transparentemente.
 */
export class SymptomLocalDataSource {
  /**
   * Salva um registro de sintoma.
   * Adiciona ao array existente no storage.
   */
  async save(entry: SymptomEntry): Promise<void> {
    try {
      const entries = await this.loadAllDTOs();
      const dto = this.toDTO(entry);
      entries.push(dto);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      throw new Error(
        `Falha ao salvar sintoma: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    }
  }

  /**
   * Retorna todos os registros, ordenados por timestamp decrescente.
   */
  async getAll(): Promise<SymptomEntry[]> {
    try {
      const dtos = await this.loadAllDTOs();
      return dtos
        .map(this.fromDTO)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      throw new Error(
        `Falha ao carregar sintomas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    }
  }

  /**
   * Busca um registro específico pelo ID.
   */
  async getById(id: string): Promise<SymptomEntry | null> {
    const dtos = await this.loadAllDTOs();
    const dto = dtos.find((d) => d.id === id);
    return dto ? this.fromDTO(dto) : null;
  }

  /**
   * Remove um registro pelo ID.
   */
  async delete(id: string): Promise<void> {
    try {
      const dtos = await this.loadAllDTOs();
      const filtered = dtos.filter((d) => d.id !== id);

      if (filtered.length === dtos.length) {
        throw new Error(`Registro com ID "${id}" não encontrado.`);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      throw new Error(
        `Falha ao remover sintoma: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    }
  }

  // --- Métodos privados de serialização ---

  private async loadAllDTOs(): Promise<SymptomEntryDTO[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as SymptomEntryDTO[];
    } catch {
      // Dados corrompidos — reseta o storage
      await AsyncStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  private toDTO(entry: SymptomEntry): SymptomEntryDTO {
    return {
      id: entry.id,
      description: entry.description,
      timestamp: entry.timestamp.toISOString(),
    };
  }

  private fromDTO(dto: SymptomEntryDTO): SymptomEntry {
    return Object.freeze({
      id: dto.id,
      description: dto.description,
      timestamp: new Date(dto.timestamp),
    });
  }
}

