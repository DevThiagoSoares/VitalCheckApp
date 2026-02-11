import { ISymptomRepository } from '../../../domain/repositories/ISymptomRepository';
import { DeleteSymptomEntry } from '../../../domain/usecases/DeleteSymptomEntry';

describe('DeleteSymptomEntry UseCase', () => {
  let mockRepository: jest.Mocked<ISymptomRepository>;
  let useCase: DeleteSymptomEntry;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      getAll: jest.fn().mockResolvedValue([]),
      getById: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    useCase = new DeleteSymptomEntry(mockRepository);
  });

  it('deve deletar um sintoma pelo ID', async () => {
    await useCase.execute('id-123');

    expect(mockRepository.delete).toHaveBeenCalledWith('id-123');
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('deve rejeitar ID vazio', async () => {
    await expect(useCase.execute('')).rejects.toThrow(
      'ID do sintoma é obrigatório'
    );

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it('deve propagar erro do repositório', async () => {
    mockRepository.delete.mockRejectedValue(
      new Error('Registro não encontrado')
    );

    await expect(useCase.execute('id-inexistente')).rejects.toThrow(
      'Registro não encontrado'
    );
  });
});

