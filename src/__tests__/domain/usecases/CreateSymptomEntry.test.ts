import { CreateSymptomEntry } from '../../../domain/usecases/CreateSymptomEntry';
import { ISymptomRepository } from '../../../domain/repositories/ISymptomRepository';
import { SymptomEntry } from '../../../domain/entities/SymptomEntry';

/**
 * Testes do Use Case CreateSymptomEntry.
 *
 * Demonstra a testabilidade da Clean Architecture:
 * - O repositório é mockado (dependência invertida via interface)
 * - O gerador de ID é injetado (sem dependência de crypto)
 * - Nenhuma dependência de framework ou infraestrutura
 */
describe('CreateSymptomEntry UseCase', () => {
  let mockRepository: jest.Mocked<ISymptomRepository>;
  let mockIdGenerator: jest.Mock<string>;
  let useCase: CreateSymptomEntry;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      getAll: jest.fn().mockResolvedValue([]),
      getById: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    mockIdGenerator = jest.fn().mockReturnValue('generated-id-1');
    useCase = new CreateSymptomEntry(mockRepository, mockIdGenerator);
  });

  it('deve criar e persistir um sintoma com sucesso', async () => {
    const entry = await useCase.execute('Dor de cabeça forte');

    expect(entry.id).toBe('generated-id-1');
    expect(entry.description).toBe('Dor de cabeça forte');
    expect(entry.timestamp).toBeInstanceOf(Date);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(entry);
  });

  it('deve gerar um ID para cada entrada', async () => {
    mockIdGenerator
      .mockReturnValueOnce('id-1')
      .mockReturnValueOnce('id-2');

    const entry1 = await useCase.execute('Sintoma 1');
    const entry2 = await useCase.execute('Sintoma 2');

    expect(entry1.id).toBe('id-1');
    expect(entry2.id).toBe('id-2');
    expect(mockIdGenerator).toHaveBeenCalledTimes(2);
  });

  it('deve propagar erro de validação da entidade', async () => {
    await expect(useCase.execute('')).rejects.toThrow(
      'A descrição do sintoma não pode ser vazia'
    );

    // Não deve chamar save se a validação falhar
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('deve propagar erro do repositório', async () => {
    mockRepository.save.mockRejectedValue(new Error('Falha no storage'));

    await expect(useCase.execute('Dor')).rejects.toThrow('Falha no storage');
  });
});

