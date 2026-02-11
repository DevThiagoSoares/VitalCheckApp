# VitalCheck — Android Nativo (Kotlin + Jetpack Compose)

Implementação nativa Android do VitalCheck usando Kotlin, Jetpack Compose e Clean Architecture.

---

## 📐 Decisões Arquiteturais

### Plataforma: Android Nativo (Kotlin + Jetpack Compose)

**Justificativa:**
- **Performance nativa**: Sem bridge ou runtime intermediário
- **Kotlin idiomático**: Coroutines, Flow, data classes, null safety nativo
- **Jetpack Compose**: UI declarativa moderna — mesma filosofia do React, com melhor integração Android
- **Material 3**: Design system nativo do Google com suporte a dynamic color

**Comparação com a versão React Native:**
- React Native oferece cross-platform (Android + iOS); Kotlin oferece performance e integração nativa superior no Android
- Ambas usam a mesma arquitetura (Clean Architecture + MVVM) — demonstrando que bons princípios transcendem frameworks
- A implementação React Native está em [`../react-native/`](../react-native/README.md)

### Arquitetura: Clean Architecture + MVVM

Mesma separação em 3 camadas da versão React Native:

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                  │
│  Screens → ViewModels → StateFlow → Compose UI   │
├─────────────────────────────────────────────────┤
│                DOMAIN LAYER                      │
│  Entities → Use Cases → Repository Interfaces    │
├─────────────────────────────────────────────────┤
│                 DATA LAYER                       │
│  Repository Impl → Data Sources → Room DB        │
└─────────────────────────────────────────────────┘

Direção das dependências: Presentation → Domain ← Data
```

### MVVM: ViewModel + StateFlow

| Conceito | Kotlin | React Native (equivalente) |
|----------|--------|---------------------------|
| ViewModel | `ViewModel` (AAC) | Custom Hook (`useVitalSigns`) |
| Estado | `StateFlow` | `useReducer` |
| Observação | `collectAsStateWithLifecycle` | `useEffect` + state |
| Ciclo de vida | `viewModelScope` (auto-cancel) | `useEffect` cleanup |

**StateFlow vs LiveData:**
Optei por `StateFlow` ao invés de `LiveData` porque:
- Integração melhor com coroutines (mesmo paradigma)
- Replay automático do último valor
- Thread-safe sem wrappers adicionais
- Testável sem `InstantTaskExecutorRule`

### Injeção de Dependência

**Decisão: DI manual via ServiceContainer + CompositionLocal**

Equivalente ao `ServiceContainer.ts` + `ServiceContext.tsx` da versão React Native.

**Justificativa vs Hilt/Dagger/Koin:**
- 2 telas e 4 use cases não justificam o boilerplate de Hilt (módulos, componentes, scopes)
- Composição explícita — cada dependência é rastreável visualmente
- Mais fácil de entender e debugar para escopo atual
- Migrável para Hilt se o projeto escalar

---

## 📦 Dependências

### Produção

| Dependência | Versão | Justificativa |
|-------------|--------|---------------|
| `compose-bom` | 2024.02.00 | BOM garante versões compatíveis de todos os artefatos Compose |
| `material3` | (via BOM) | Design system nativo do Google — tipografia, cores, componentes |
| `material-icons-extended` | (via BOM) | Ícones vetoriais — equivalente ao Ionicons da versão RN |
| `navigation-compose` | 2.7.7 | Navegação tipo-safe com integração Compose |
| `lifecycle-runtime-compose` | 2.7.0 | `collectAsStateWithLifecycle` — coleta lifecycle-aware |
| `lifecycle-viewmodel-compose` | 2.7.0 | Integração ViewModel ↔ Compose |
| `room-runtime` + `room-ktx` | 2.6.1 | Persistência local com tipagem SQL em compilação |
| `room-compiler` (KSP) | 2.6.1 | Geração de código Room via KSP |
| `coroutines-android` | 1.8.0 | Concorrência estruturada — async sem callbacks |
| `activity-compose` | 1.8.2 | Ponte entre Activity e Compose |
| `core-ktx` | 1.12.0 | Extensões Kotlin para APIs Android |

### Teste

| Dependência | Versão | Justificativa |
|-------------|--------|---------------|
| `junit` | 4.13.2 | Framework de testes — padrão da JVM |
| `coroutines-test` | 1.8.0 | `runTest`, `StandardTestDispatcher` para testes de coroutines |
| `turbine` | 1.1.0 | Testes de Flow — API declarativa (`test { awaitItem() }`) |
| `mockk` | 1.13.10 | Mocking para Kotlin — suporte a suspend functions e coroutines |
| `core-testing` | 2.2.0 | Utilitários para testar ViewModels (dispatcher override) |

### Rejeitadas

| Biblioteca | Motivo |
|------------|--------|
| **Hilt / Dagger** | Overkill para 2 telas — DI manual é mais transparente e rastreável |
| **Koin** | Mais simples que Hilt mas ainda adiciona runtime overhead desnecessário |
| **DataStore** | Room é mais adequado — queries SQL, migrações e validação em compilação |
| **Retrofit / OkHttp** | Sem API remota no escopo atual — seria adicionado quando necessário |
| **Coil / Glide** | Sem imagens remotas — Material Icons são vetoriais locais |

---

## ▶️ Instruções de Execução

### Pré-requisitos

- **Android Studio** Hedgehog (2023.1.1) ou superior
- **JDK 17** (bundled no Android Studio)
- **Android SDK 34** (API 34)
- **Emulador** ou dispositivo Android com API 26+ (Android 8.0+)

### Build e Execução via Android Studio (recomendado)

1. Abrir o Android Studio
2. `File → Open` → selecionar a pasta `kotlin/`
3. Aguardar o **Gradle Sync** completar (primeira vez pode levar alguns minutos)
4. Selecionar um dispositivo no dropdown de targets (ver seção Emulador abaixo)
5. Clicar em **▶ Run 'app'**

### Configurar Emulador Android

Se você não tiver um emulador configurado:

1. No Android Studio: `Tools → Device Manager` (ou ícone de celular na lateral direita)
2. Clicar em **Create Virtual Device**
3. Selecionar um dispositivo (ex: **Medium Phone**)
4. Selecionar a imagem do sistema (ex: **API 34** ou superior) → **Download** se necessário
5. Finalizar e clicar no **▶** ao lado do emulador para iniciá-lo
6. Com o emulador rodando, clicar em **▶ Run 'app'** no Android Studio

**Via terminal** (requer emulador já criado):

```bash
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar emulador
emulator -avd <NOME_DO_AVD> &

# Compilar e instalar
cd kotlin
./gradlew installDebug
```

### Build via Terminal

```bash
cd kotlin

# Compilar APK de debug
./gradlew assembleDebug

# Instalar no dispositivo/emulador conectado
./gradlew installDebug
```

### Testes

```bash
# Executar testes unitários
./gradlew test

# Testes com relatório HTML
./gradlew testDebugUnitTest
# Relatório em: app/build/reports/tests/testDebugUnitTest/
```

### Requisitos de Plataforma

| Requisito | Versão |
|-----------|--------|
| Android mínimo | API 26 (Android 8.0) |
| Android target | API 34 (Android 14) |
| Kotlin | 1.9.22 |
| Gradle | 8.5 |
| JDK | 17 |
| Compose Compiler | 1.5.10 |

---

## 🏗️ Estrutura do Projeto

```
kotlin/
├── app/src/main/java/com/vitalcheck/app/
│   ├── domain/                           # 🟢 Camada de Domínio (pura)
│   │   ├── entity/
│   │   │   ├── VitalSign.kt             # Data class com validação (init block)
│   │   │   └── SymptomEntry.kt          # Data class + factory companion object
│   │   ├── repository/
│   │   │   ├── IVitalSignProvider.kt    # Interface → Flow<VitalSign>
│   │   │   └── ISymptomRepository.kt    # Interface → suspend functions
│   │   └── usecase/
│   │       ├── ObserveVitalSigns.kt     # UC: Flow de sinais vitais
│   │       ├── CreateSymptomEntry.kt    # UC: Criar + salvar
│   │       ├── GetSymptomHistory.kt     # UC: Listar histórico
│   │       └── DeleteSymptomEntry.kt    # UC: Remover registro
│   │
│   ├── data/                            # 🔵 Camada de Dados
│   │   ├── local/
│   │   │   ├── SymptomDatabase.kt       # Room Database (Singleton)
│   │   │   ├── SymptomDao.kt            # Data Access Object
│   │   │   └── SymptomDbEntity.kt       # Entidade Room + mapeamento
│   │   ├── datasource/
│   │   │   ├── MockVitalSignProvider.kt # Simulador (Flow + delay)
│   │   │   └── SymptomLocalDataSource.kt # Abstração sobre DAO
│   │   └── repository/
│   │       ├── VitalSignRepositoryImpl.kt
│   │       └── SymptomRepositoryImpl.kt
│   │
│   ├── presentation/                    # 🟡 Camada de Apresentação
│   │   ├── screen/
│   │   │   ├── DashboardScreen.kt       # Compose UI — sinais vitais
│   │   │   └── SymptomLogScreen.kt      # Compose UI — diário
│   │   ├── components/
│   │   │   ├── VitalCard.kt             # Card com animação
│   │   │   ├── SymptomForm.kt           # Formulário + haptics
│   │   │   ├── SymptomItem.kt           # Item + dialog de exclusão
│   │   │   ├── EmptyState.kt            # Estado vazio
│   │   │   └── ErrorBanner.kt           # Erro não-bloqueante
│   │   ├── viewmodel/
│   │   │   ├── VitalSignsViewModel.kt   # StateFlow + coroutines
│   │   │   └── SymptomLogViewModel.kt   # CRUD + estados de UI
│   │   ├── navigation/
│   │   │   └── AppNavigation.kt         # Navigation Compose + bottom bar
│   │   └── theme/
│   │       ├── Color.kt                 # Paleta VitalCheck
│   │       ├── Type.kt                  # Tipografia Material 3
│   │       └── Theme.kt                 # Theme + CompositionLocal DI
│   │
│   ├── di/
│   │   └── ServiceContainer.kt          # Composition Root
│   │
│   ├── shared/
│   │   └── DateFormatter.kt             # Formatação relativa pt-BR
│   │
│   ├── VitalCheckApplication.kt         # Application — init do container
│   └── MainActivity.kt                  # Activity → Compose entry point
│
├── app/src/test/                        # 🧪 Testes unitários
│   └── java/com/vitalcheck/app/
│       ├── domain/entity/               # Testes de entidades
│       ├── domain/usecase/              # Testes de use cases
│       ├── data/datasource/             # Testes de data sources
│       └── presentation/viewmodel/      # Testes de ViewModels
│
├── build.gradle.kts                     # Root build config
├── app/build.gradle.kts                 # App build + dependências
├── settings.gradle.kts                  # Módulos + repositórios
└── gradle.properties                    # JVM args + Android config
```

---

## 🧪 Testes

### Cobertura por Camada

| Camada | Suites | Testes | O que é testado |
|--------|--------|--------|-----------------|
| **Domain / Entities** | 2 | 20 | Validação, limites, imutabilidade, factory |
| **Domain / Use Cases** | 3 | 8 | Orquestração, propagação de erros |
| **Data / DataSources** | 1 | 3 | Flow, valores realistas, incremento monotônico |
| **Presentation / VMs** | 1 | 3 | Transições de estado, erro, lifecycle |

### Ferramentas de Teste

- **JUnit 4**: Assertions e lifecycle de teste
- **MockK**: Mocking idiomático para Kotlin (suspend, Flow)
- **Turbine**: Testes de Flow com API declarativa — `test { awaitItem() }`
- **coroutines-test**: `runTest`, `StandardTestDispatcher`, `advanceUntilIdle`

---

## 🧠 Uso de IA

Mesma política da versão React Native — detalhes no [README do root](../README.md).

---

## 📝 Licença

MIT

