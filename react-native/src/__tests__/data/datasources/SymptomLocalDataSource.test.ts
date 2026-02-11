import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymptomLocalDataSource } from '../../../data/datasources/SymptomLocalDataSource';

// O AsyncStorage é automaticamente mockado via moduleNameMapper no jest.config.ts

describe('SymptomLocalDataSource', () => {
  let dataSource: SymptomLocalDataSource;

  beforeEach(async () => {
    dataSource = new SymptomLocalDataSource();
    // Limpa o storage entre testes
    await (AsyncStorage as any).clear();
    jest.clearAllMocks();
  });

  const createEntry = (id: string, description: string, timestamp?: Date) => ({
    id,
    description,
    timestamp: timestamp ?? new Date('2026-02-10T12:00:00Z'),
  });

  describe('save', () => {
    it('deve salvar um registro com sucesso', async () => {
      const entry = createEntry('id-1', 'Dor de cabeça');

      await dataSource.save(entry);

      const entries = await dataSource.getAll();
      expect(entries).toHaveLength(1);
      expect(entries[0].id).toBe('id-1');
      expect(entries[0].description).toBe('Dor de cabeça');
    });

    it('deve salvar múltiplos registros', async () => {
      await dataSource.save(createEntry('id-1', 'Dor de cabeça'));
      await dataSource.save(createEntry('id-2', 'Náusea'));
      await dataSource.save(createEntry('id-3', 'Tontura'));

      const entries = await dataSource.getAll();
      expect(entries).toHaveLength(3);
    });
  });

  describe('getAll', () => {
    it('deve retornar array vazio quando não há registros', async () => {
      const entries = await dataSource.getAll();
      expect(entries).toEqual([]);
    });

    it('deve retornar registros ordenados por timestamp decrescente', async () => {
      await dataSource.save(createEntry('id-1', 'Primeiro', new Date('2026-02-08')));
      await dataSource.save(createEntry('id-2', 'Segundo', new Date('2026-02-10')));
      await dataSource.save(createEntry('id-3', 'Terceiro', new Date('2026-02-09')));

      const entries = await dataSource.getAll();

      expect(entries[0].id).toBe('id-2'); // Mais recente
      expect(entries[1].id).toBe('id-3');
      expect(entries[2].id).toBe('id-1'); // Mais antigo
    });

    it('deve preservar dados após serialização/deserialização', async () => {
      const timestamp = new Date('2026-02-10T15:30:00Z');
      await dataSource.save(createEntry('id-1', 'Teste', timestamp));

      const entries = await dataSource.getAll();

      expect(entries[0].timestamp).toEqual(timestamp);
      expect(entries[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getById', () => {
    it('deve encontrar registro existente', async () => {
      await dataSource.save(createEntry('id-target', 'Alvo'));
      await dataSource.save(createEntry('id-other', 'Outro'));

      const found = await dataSource.getById('id-target');

      expect(found).not.toBeNull();
      expect(found?.description).toBe('Alvo');
    });

    it('deve retornar null para registro inexistente', async () => {
      const found = await dataSource.getById('id-inexistente');
      expect(found).toBeNull();
    });
  });

  describe('delete', () => {
    it('deve remover registro existente', async () => {
      await dataSource.save(createEntry('id-1', 'Manter'));
      await dataSource.save(createEntry('id-2', 'Remover'));

      await dataSource.delete('id-2');

      const entries = await dataSource.getAll();
      expect(entries).toHaveLength(1);
      expect(entries[0].id).toBe('id-1');
    });

    it('deve lançar erro ao tentar remover registro inexistente', async () => {
      await expect(dataSource.delete('id-inexistente')).rejects.toThrow(
        'não encontrado'
      );
    });
  });
});

