import { MockVitalSignProvider } from '../../../data/datasources/MockVitalSignProvider';
import { VitalSign } from '../../../domain/entities/VitalSign';

describe('MockVitalSignProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve emitir leitura imediata ao subscrever', () => {
    const provider = new MockVitalSignProvider(3000);
    const callback = jest.fn();

    provider.subscribe(callback);

    // Deve ter emitido imediatamente (sem esperar o intervalo)
    expect(callback).toHaveBeenCalledTimes(1);
    const reading: VitalSign = callback.mock.calls[0][0];
    expect(reading.heartRate).toBeGreaterThanOrEqual(50);
    expect(reading.heartRate).toBeLessThanOrEqual(130);
    expect(reading.steps).toBeGreaterThanOrEqual(0);
    expect(reading.timestamp).toBeInstanceOf(Date);
  });

  it('deve emitir leituras periódicas no intervalo configurado', () => {
    const provider = new MockVitalSignProvider(1000);
    const callback = jest.fn();

    provider.subscribe(callback);

    // 1 leitura imediata
    expect(callback).toHaveBeenCalledTimes(1);

    // Avança 3 segundos → 3 leituras adicionais
    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(4);
  });

  it('deve parar de emitir ao chamar unsubscribe', () => {
    const provider = new MockVitalSignProvider(1000);
    const callback = jest.fn();

    const unsubscribe = provider.subscribe(callback);
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();

    jest.advanceTimersByTime(5000);
    // Não deve ter emitido mais após unsubscribe
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('deve atualizar getLatest após cada emissão', () => {
    const provider = new MockVitalSignProvider(1000);

    expect(provider.getLatest()).toBeNull();

    const callback = jest.fn();
    provider.subscribe(callback);

    const latest = provider.getLatest();
    expect(latest).not.toBeNull();
    expect(latest?.heartRate).toBeDefined();
    expect(latest?.steps).toBeDefined();
  });

  it('deve gerar valores de frequência cardíaca dentro de faixa realista', () => {
    const provider = new MockVitalSignProvider(100);
    const readings: VitalSign[] = [];

    provider.subscribe((reading) => readings.push(reading));

    jest.advanceTimersByTime(2000); // 20 leituras adicionais

    readings.forEach((reading) => {
      expect(reading.heartRate).toBeGreaterThanOrEqual(40);
      expect(reading.heartRate).toBeLessThanOrEqual(140);
    });
  });

  it('deve incrementar passos monotonicamente', () => {
    const provider = new MockVitalSignProvider(100);
    const readings: VitalSign[] = [];

    provider.subscribe((reading) => readings.push(reading));

    jest.advanceTimersByTime(1000); // 10 leituras adicionais

    for (let i = 1; i < readings.length; i++) {
      expect(readings[i].steps).toBeGreaterThanOrEqual(readings[i - 1].steps);
    }
  });
});

