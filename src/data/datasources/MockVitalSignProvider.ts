import { VitalSign, createVitalSign } from '../../domain/entities/VitalSign';
import { IVitalSignProvider } from '../../domain/repositories/IVitalSignProvider';

/**
 * Implementação simulada do provedor de sinais vitais.
 *
 * Gera dados realistas de frequência cardíaca e passos, simulando
 * o comportamento de um sensor real. Os valores variam dentro de
 * faixas fisiologicamente plausíveis para maior verossimilhança.
 *
 * Esta implementação pode ser substituída por um provedor real
 * (ex: Google Fit, Apple HealthKit) sem alterar nenhuma outra camada,
 * graças à abstração via IVitalSignProvider.
 *
 * Intervalo padrão: 3 segundos (configurável via construtor).
 */
export class MockVitalSignProvider implements IVitalSignProvider {
  private latestReading: VitalSign | null = null;
  private baseHeartRate: number;
  private totalSteps: number;

  constructor(private readonly intervalMs: number = 3000) {
    // Inicia com valores base realistas
    this.baseHeartRate = 72;
    this.totalSteps = Math.floor(Math.random() * 5000);
  }

  subscribe(onData: (vitalSign: VitalSign) => void): () => void {
    // Emite leitura imediata ao iniciar a observação
    this.emitReading(onData);

    const intervalId = setInterval(() => {
      this.emitReading(onData);
    }, this.intervalMs);

    // Retorna função de cleanup (Disposable pattern)
    return () => {
      clearInterval(intervalId);
    };
  }

  getLatest(): VitalSign | null {
    return this.latestReading;
  }

  /**
   * Gera e emite uma leitura simulada com variação realista.
   *
   * A frequência cardíaca varia ±5 bpm em torno de uma base que
   * oscila lentamente, simulando variação natural ao longo do tempo.
   * Os passos incrementam aleatoriamente entre 0-15 por ciclo.
   */
  private emitReading(onData: (vitalSign: VitalSign) => void): void {
    // Varia a base lentamente (simula mudança de atividade)
    this.baseHeartRate += (Math.random() - 0.5) * 4;
    this.baseHeartRate = Math.max(55, Math.min(120, this.baseHeartRate));

    // Adiciona ruído instantâneo (variabilidade natural)
    const heartRate = Math.round(
      this.baseHeartRate + (Math.random() - 0.5) * 10
    );

    // Incrementa passos (0-15 passos por ciclo de 3s é realista para caminhada)
    this.totalSteps += Math.floor(Math.random() * 16);

    const reading = createVitalSign(heartRate, this.totalSteps);
    this.latestReading = reading;
    onData(reading);
  }
}

