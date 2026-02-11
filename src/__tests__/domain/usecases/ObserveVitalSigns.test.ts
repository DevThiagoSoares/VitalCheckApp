import { createVitalSign } from '../../../domain/entities/VitalSign';
import { IVitalSignProvider } from '../../../domain/repositories/IVitalSignProvider';
import { ObserveVitalSigns } from '../../../domain/usecases/ObserveVitalSigns';

describe('ObserveVitalSigns UseCase', () => {
  let mockProvider: jest.Mocked<IVitalSignProvider>;
  let useCase: ObserveVitalSigns;

  beforeEach(() => {
    mockProvider = {
      subscribe: jest.fn(),
      getLatest: jest.fn(),
    };
    useCase = new ObserveVitalSigns(mockProvider);
  });

  it('deve delegar subscribe ao provider', () => {
    const callback = jest.fn();
    const unsubscribe = jest.fn();
    mockProvider.subscribe.mockReturnValue(unsubscribe);

    const result = useCase.execute(callback);

    expect(mockProvider.subscribe).toHaveBeenCalledWith(callback);
    expect(result).toBe(unsubscribe);
  });

  it('deve retornar a última leitura do provider', () => {
    const reading = createVitalSign(80, 1000);
    mockProvider.getLatest.mockReturnValue(reading);

    const result = useCase.getLatest();

    expect(result).toBe(reading);
    expect(mockProvider.getLatest).toHaveBeenCalled();
  });

  it('deve retornar null quando não há leitura', () => {
    mockProvider.getLatest.mockReturnValue(null);

    expect(useCase.getLatest()).toBeNull();
  });
});

