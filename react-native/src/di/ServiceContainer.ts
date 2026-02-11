import { MockVitalSignProvider } from '../data/datasources/MockVitalSignProvider';
import { SymptomLocalDataSource } from '../data/datasources/SymptomLocalDataSource';
import { VitalSignRepositoryImpl } from '../data/repositories/VitalSignRepositoryImpl';
import { SymptomRepositoryImpl } from '../data/repositories/SymptomRepositoryImpl';
import { IVitalSignProvider } from '../domain/repositories/IVitalSignProvider';
import { ISymptomRepository } from '../domain/repositories/ISymptomRepository';
import { ObserveVitalSigns } from '../domain/usecases/ObserveVitalSigns';
import { CreateSymptomEntry } from '../domain/usecases/CreateSymptomEntry';
import { GetSymptomHistory } from '../domain/usecases/GetSymptomHistory';
import { DeleteSymptomEntry } from '../domain/usecases/DeleteSymptomEntry';
import { generateId } from '../shared/utils/idGenerator';

/**
 * Container de Injeção de Dependência (Composition Root).
 *
 * Centraliza a criação e wiring de todas as dependências da aplicação.
 * Este é o ÚNICO lugar onde implementações concretas são instanciadas
 * e conectadas às abstrações.
 *
 * Abordagem: Service Locator simples com instâncias singleton.
 *
 * Justificativa da escolha:
 * - Evita overhead de frameworks de DI (inversify, tsyringe) para o escopo atual
 * - Mantém a composição explícita e rastreável
 * - Permite troca fácil de implementações (ex: MockProvider → RealProvider)
 * - Pode migrar para Context-based DI no React se necessário
 *
 * Trade-off: menos automação que um framework de DI, porém mais transparência.
 */
export class ServiceContainer {
  // --- Data Sources (singleton) ---
  private readonly vitalSignDataSource: MockVitalSignProvider;
  private readonly symptomDataSource: SymptomLocalDataSource;

  // --- Repositories ---
  readonly vitalSignProvider: IVitalSignProvider;
  readonly symptomRepository: ISymptomRepository;

  // --- Use Cases ---
  readonly observeVitalSigns: ObserveVitalSigns;
  readonly createSymptomEntry: CreateSymptomEntry;
  readonly getSymptomHistory: GetSymptomHistory;
  readonly deleteSymptomEntry: DeleteSymptomEntry;

  constructor() {
    // 1. Instancia Data Sources
    this.vitalSignDataSource = new MockVitalSignProvider(3000);
    this.symptomDataSource = new SymptomLocalDataSource();

    // 2. Instancia Repositories (conectando interfaces a implementações)
    this.vitalSignProvider = new VitalSignRepositoryImpl(this.vitalSignDataSource);
    this.symptomRepository = new SymptomRepositoryImpl(this.symptomDataSource);

    // 3. Instancia Use Cases (injetando dependências do domínio)
    this.observeVitalSigns = new ObserveVitalSigns(this.vitalSignProvider);
    this.createSymptomEntry = new CreateSymptomEntry(this.symptomRepository, generateId);
    this.getSymptomHistory = new GetSymptomHistory(this.symptomRepository);
    this.deleteSymptomEntry = new DeleteSymptomEntry(this.symptomRepository);
  }
}

/**
 * Instância singleton do container.
 * Inicializada uma única vez no lifecycle do app.
 */
export const container = new ServiceContainer();

