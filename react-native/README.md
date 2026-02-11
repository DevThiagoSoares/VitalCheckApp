# VitalCheck — React Native (Expo + TypeScript)

Implementação cross-platform do VitalCheck usando React Native, Expo e TypeScript com Clean Architecture.

---

## 📐 Decisões Arquiteturais

### Plataforma Escolhida: React Native (Expo) + TypeScript

**Justificativa:**
- **Cross-platform**: Uma única codebase para Android e iOS, reduzindo custo e tempo de desenvolvimento
- **TypeScript com strict mode**: Tipagem estática rigorosa que previne erros em tempo de compilação e melhora a documentação implícita do código
- **Expo SDK 54**: Framework maduro que simplifica build, deploy e acesso a APIs nativas sem necessidade de configuração nativa manual
- **Ecossistema React**: Vasta comunidade, bibliotecas bem mantidas e padrões consolidados

**Alternativas consideradas:**
- **Kotlin/Android nativo**: Implementado em paralelo na pasta `kotlin/` — oferece melhor performance nativa, porém limitado a Android. React Native complementa cobrindo iOS com a mesma codebase
- **Flutter**: Alternativa válida, porém o ecossistema React Native é mais maduro para integrações com serviços de saúde existentes (Google Fit, Apple HealthKit)

### Arquitetura: Clean Architecture + MVVM (via Hooks + Reducers)

A aplicação segue **Clean Architecture** com separação rígida em 3 camadas, combinada com o padrão **MVVM** implementado de forma idiomática em React via custom hooks e reducers puros.

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                  │
│  Screens → Hooks (ViewModels) → Reducers → UI   │
├─────────────────────────────────────────────────┤
│                DOMAIN LAYER                      │
│  Entities → Use Cases → Repository Interfaces    │
├─────────────────────────────────────────────────┤
│                 DATA LAYER                       │
│  Repository Impl → Data Sources → AsyncStorage   │
└─────────────────────────────────────────────────┘

Direção das dependências: Presentation → Domain ← Data
(O domínio não depende de nenhuma camada externa)
```

### Responsabilidades por Camada

| Camada | Responsabilidade | Exemplos |
|--------|-----------------|----------|
| **Domain** | Regras de negócio puras, sem dependência de frameworks | `VitalSign`, `SymptomEntry`, `CreateSymptomEntry`, `ISymptomRepository` |
| **Data** | Implementações concretas de persistência e fontes de dados | `SymptomLocalDataSource`, `MockVitalSignProvider`, `SymptomRepositoryImpl` |
| **Presentation** | UI, estado da tela e interação com usuário | `DashboardScreen`, `useVitalSigns`, `vitalSignsReducer`, `VitalCard` |

### Direção de Dependência

- **Presentation** depende de **Domain** (usa entidades e use cases)
- **Data** depende de **Domain** (implementa interfaces definidas no domínio)
- **Domain** não depende de nenhuma outra camada (núcleo puro)
- A inversão de dependência é garantida por interfaces no domínio (ex: `ISymptomRepository`) implementadas na camada Data

### Gerenciamento de Estado: useReducer + Reducers Puros

Os ViewModels (custom hooks) utilizam `useReducer` com **reducers extraídos em arquivos separados**:

- **Transições explícitas**: Cada mudança de estado é uma action tipada via discriminated unions
- **Testabilidade superior**: Reducers são funções puras, testáveis sem React, hooks ou mocks
- **Fluxo unidirecional**: Action → Reducer → Novo Estado → UI (previsível e rastreável)
- **Separação de concerns**: Reducer (lógica de transição) separado do Hook (side-effects)

**Justificativa vs useState:** Para estados com múltiplas propriedades interdependentes (loading, error, data, saving), `useReducer` garante que transições sejam atômicas e consistentes, eliminando bugs de "partial state updates".

### Injeção de Dependência

Utilizo um **Service Container** (Composition Root) combinado com **React Context** para DI:

- `ServiceContainer.ts`: Instancia e conecta todas as dependências (único local com `new`)
- `ServiceContext.tsx`: Provê o container via React Context para toda a árvore
- `useServices()`: Hook para consumir serviços em qualquer componente

**Justificativa:** Evita frameworks de DI (inversify, tsyringe) que adicionam complexidade desnecessária para o escopo atual, mantendo a composição explícita e testável.

---

## 📦 Gerenciamento de Dependências

### Dependências de Produção

| Dependência | Versão | Justificativa |
|-------------|--------|---------------|
| `expo` | ~54.0.33 | Framework React Native — gerencia build, assets e acesso a APIs nativas |
| `react` | 19.1.0 | Biblioteca de UI declarativa — base do React Native |
| `react-native` | 0.81.5 | Framework mobile — renderização nativa multiplataforma |
| `expo-status-bar` | ~3.0.9 | Controle da status bar do dispositivo |
| `expo-crypto` | ~15.0.8 | Geração de UUIDs criptograficamente seguros (substitui lib `uuid`) |
| `expo-haptics` | SDK 54 | Feedback háptico nativo ao salvar/deletar — UX premium |
| `@react-navigation/native` | ^7.x | Navegação — padrão da comunidade RN, altamente customizável |
| `@react-navigation/bottom-tabs` | ^7.x | Tab navigation — padrão UX consolidado para apps de saúde |
| `react-native-screens` | ~4.16.0 | Otimização de performance de navegação (telas nativas) |
| `react-native-safe-area-context` | ~5.6.0 | Gerenciamento de safe areas (notch, barra de status) |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistência local key-value — simples e confiável |

### Dependências de Desenvolvimento

| Dependência | Versão | Justificativa |
|-------------|--------|---------------|
| `typescript` | ~5.9.2 | Tipagem estática — prevenção de erros e documentação |
| `@types/react` | ~19.1.0 | Tipos TypeScript para React |
| `jest` | ^30.2.0 | Framework de testes — padrão da indústria para JS/TS |
| `ts-jest` | ^29.4.6 | Transformer TypeScript para Jest |
| `@types/jest` | ^30.0.0 | Tipos TypeScript para Jest |
| `eslint` | ^9.x | Linter — garante consistência e previne erros comuns |
| `@typescript-eslint/*` | ^8.x | Parser e plugin ESLint para TypeScript |
| `prettier` | ^3.x | Formatter — estilo de código consistente e automático |
| `eslint-config-prettier` | ^10.x | Desativa regras ESLint que conflitam com Prettier |

### Dependências Rejeitadas e Justificativas

| Biblioteca | Motivo da rejeição |
|------------|-------------------|
| **Redux / Zustand** | Overhead desnecessário — `useReducer` + Context cobrem o escopo atual com menos boilerplate |
| **date-fns / moment** | `Intl.DateTimeFormat` nativo é suficiente e evita aumento do bundle |
| **uuid** | `expo-crypto.randomUUID()` já disponível no Expo, sem dependência extra |
| **SQLite** | AsyncStorage é adequado para o volume de dados atual. A abstração via repository permite migração transparente futura |
| **expo-router** | File-based routing adiciona complexidade para apenas 2 rotas. @react-navigation oferece controle mais explícito |
| **inversify / tsyringe** | Frameworks de DI são overkill — Service Container manual é mais transparente e rastreável |
| **react-native-reanimated** | Animated API nativa é suficiente para as animações de pulse nos cards |

---

## ▶️ Instruções de Execução

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (ou yarn)
- **Expo Go** app instalado no dispositivo (Android/iOS) para teste rápido
- Ou: **Android Studio** com emulador configurado para desenvolvimento local

### Instalação

```bash
# A partir da raiz do repositório
cd react-native

# Instalar dependências
npm install
```

### Executar o Projeto

```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Ou diretamente para Android (emulador ou dispositivo conectado)
npx expo start --android

# Ou para iOS (requer macOS + Xcode)
npx expo start --ios

# Ou para Web (desenvolvimento/debug)
npx expo start --web
```

### Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch (desenvolvimento)
npm run test:watch

# Testes com cobertura de código
npm run test:coverage
```

### Verificação de Qualidade

```bash
# Verificar erros de TypeScript
npm run typecheck

# Executar linter
npm run lint
```

### Requisitos de Plataforma

| Plataforma | Requisito Mínimo |
|------------|-----------------|
| Android | API 24+ (Android 7.0) |
| iOS | iOS 15.1+ |
| Node.js | v18+ |
| Expo Go | Versão compatível com SDK 54 |

---

## 🧪 Testes

O projeto inclui **59 testes unitários** cobrindo todas as camadas testáveis:

### Cobertura por Camada

| Camada | Suites | Testes | O que é testado |
|--------|--------|--------|-----------------|
| **Domain / Entities** | 2 | 18 | Validação de invariantes, imutabilidade, factory functions |
| **Domain / Use Cases** | 3 | 10 | Orquestração correta, propagação de erros, interação com repositórios |
| **Data / DataSources** | 2 | 15 | Persistência, serialização, ordenação, edge cases |
| **Presentation / Reducers** | 2 | 16 | Transições de estado, consistência, actions desconhecidas |

### Estratégia de Testes

- **Entidades**: Testam invariantes de domínio (limites de valores, imutabilidade, validações)
- **Use Cases**: Testam com repositórios mockados — validam orquestração e propagação de erros
- **Data Sources**: Testam serialização/deserialização, ordenação e resiliência a dados corrompidos
- **Reducers**: Testam funções puras isoladamente — cada action type valida a transição de estado

**Design para testabilidade:**
- Reducers extraídos em arquivos `.ts` puros (sem JSX, sem React)
- Interfaces de domínio permitem mocks triviais
- ID generation injetado via factory function (não acoplado a crypto)
- AsyncStorage mockado via `moduleNameMapper` do Jest

---

## 🏗️ Estrutura do Projeto

```
src/
├── domain/                        # 🟢 Camada de Domínio (pura, zero dependências)
│   ├── entities/
│   │   ├── VitalSign.ts           # Entidade + factory com validação
│   │   └── SymptomEntry.ts        # Entidade + factory com validação
│   ├── repositories/
│   │   ├── IVitalSignProvider.ts   # Interface para provedores de sinais vitais
│   │   └── ISymptomRepository.ts   # Interface para persistência de sintomas
│   └── usecases/
│       ├── ObserveVitalSigns.ts    # UC: Monitorar sinais vitais
│       ├── CreateSymptomEntry.ts   # UC: Criar registro de sintoma
│       ├── GetSymptomHistory.ts    # UC: Obter histórico
│       └── DeleteSymptomEntry.ts   # UC: Remover registro
│
├── data/                           # 🔵 Camada de Dados (implementações concretas)
│   ├── datasources/
│   │   ├── MockVitalSignProvider.ts    # Simulador com dados realistas
│   │   └── SymptomLocalDataSource.ts   # Persistência via AsyncStorage
│   └── repositories/
│       ├── VitalSignRepositoryImpl.ts  # Implementação do IVitalSignProvider
│       └── SymptomRepositoryImpl.ts    # Implementação do ISymptomRepository
│
├── presentation/                   # 🟡 Camada de Apresentação
│   ├── screens/
│   │   ├── DashboardScreen.tsx     # Tela com sinais vitais + animações
│   │   └── SymptomLogScreen.tsx    # Tela do diário de sintomas
│   ├── components/
│   │   ├── VitalCard.tsx           # Card com animação de pulse
│   │   ├── SymptomForm.tsx         # Formulário + haptic feedback
│   │   ├── SymptomItem.tsx         # Item com confirmação de exclusão
│   │   ├── EmptyState.tsx          # Estado vazio genérico
│   │   └── ErrorBanner.tsx         # Banner de erro com auto-dismiss
│   ├── hooks/
│   │   ├── useVitalSigns.ts       # ViewModel: sinais vitais
│   │   └── useSymptomLog.ts       # ViewModel: diário de sintomas
│   ├── reducers/
│   │   ├── vitalSignsReducer.ts   # Reducer puro (testável isoladamente)
│   │   └── symptomLogReducer.ts   # Reducer puro (testável isoladamente)
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Bottom Tabs navigation
│   └── theme/
│       ├── colors.ts               # Paleta de cores centralizada
│       └── spacing.ts              # Sistema de espaçamento (escala 4px)
│
├── di/                             # ⚙️ Injeção de Dependência
│   ├── ServiceContainer.ts         # Composition Root
│   └── ServiceContext.tsx          # React Context provider
│
├── shared/                         # 🔧 Utilitários compartilhados
│   └── utils/
│       ├── idGenerator.ts          # UUID via expo-crypto
│       └── dateFormatter.ts        # Formatação pt-BR via Intl
│
└── __tests__/                      # 🧪 Testes unitários
    ├── __mocks__/                  # Mocks de módulos nativos
    ├── domain/                     # Testes de entidades e use cases
    ├── data/                       # Testes de data sources
    └── presentation/               # Testes de reducers
```

---

## 🧠 Uso de IA e Ética

Detalhes completos no [README do root](../README.md).

### Como a IA foi utilizada

A IA (Claude/Cursor) foi utilizada como **ferramenta de aceleração**, não como substituto do engenheiro:

1. **Scaffolding acelerado**: A IA auxiliou na geração da estrutura de arquivos e boilerplate, sempre sob direção arquitetural humana
2. **Implementação de padrões**: Código que segue padrões conhecidos (Repository, Factory, Observer, Reducer) foi gerado com assistência de IA
3. **Testes**: Estrutura e cenários de teste co-criados — a IA sugeriu cenários, o humano validou a relevância
4. **Documentação**: Comentários e README foram co-criados com IA, revisados para precisão técnica

### Fronteira entre decisões humanas e IA

| Decisão | Tomada por |
|---------|-----------|
| Escolha de React Native + TypeScript | Humano — baseada em requisitos de cross-platform e experiência |
| Arquitetura Clean Architecture + MVVM | Humano — padrão escolhido por maturidade e testabilidade |
| Separação de camadas e direção de dependências | Humano — princípio SOLID aplicado conscientemente |
| Escolha de AsyncStorage vs SQLite | Humano — análise de trade-offs para o escopo do projeto |
| Rejeição de Redux em favor de useReducer + Context | Humano — avaliação de complexidade vs necessidade real |
| Extração de reducers em arquivos puros | Humano — decisão para melhorar testabilidade |
| Implementação concreta dos componentes | Co-criação (IA gerou, humano revisou e ajustou) |
| Estratégia de tratamento de erros | Humano — decisão de erros não-bloqueantes com feedback visual |
| Validação de domínio nas entidades | Humano — garantia de invariantes do domínio |
| Confirmação de exclusão com Alert | Humano — decisão de UX defensiva para app de saúde |
| Haptic feedback e animações | Humano — decisão de produto para melhorar percepção de qualidade |

### Garantia de Correção e Ownership

- **59 testes unitários** passando em todas as camadas testáveis
- **Revisão linha a linha**: Todo código gerado por IA foi revisado antes de ser aceito
- **Verificação de tipos**: TypeScript com `strict: true` — compilação limpa (`npx tsc --noEmit`)
- **Compreensão total**: Cada decisão arquitetural pode ser explicada e justificada — não há "caixa preta"
- **Trade-offs documentados**: Alternativas rejeitadas estão documentadas com justificativa

---

## 🎯 Decisões de Produto e Engenharia

### Dados Simulados (Mock)

Os sinais vitais são gerados por `MockVitalSignProvider` com valores fisiologicamente plausíveis:
- Frequência cardíaca oscila entre 55-120 bpm com variação natural (base drift + noise)
- Passos incrementam monotonicamente simulando caminhada (0-15 por ciclo de 3s)

A abstração via `IVitalSignProvider` permite substituir por integração real (Google Fit, Apple HealthKit) sem alterar domínio ou UI.

### Persistência Local

AsyncStorage foi escolhido por:
- Simplicidade para dados textuais de baixo volume
- Suporte nativo no ecossistema Expo
- A abstração via `ISymptomRepository` permite migrar para SQLite/MMKV transparentemente

### Estratégia de Erros

- **Entidades**: Validação fail-fast com mensagens descritivas em português
- **Data Sources**: Erros encapsulados com mensagens contextuais. Dados corrompidos são tratados graciosamente (reset)
- **UI**: Banners de erro não-bloqueantes com auto-dismiss — o usuário é informado sem perder o fluxo

### UX e Feedback

- **Animação de pulse** nos VitalCards quando valores atualizam (feedback visual de dados novos)
- **Haptic feedback** ao salvar/deletar sintomas (percepção tátil de ação completada)
- **Confirmação de exclusão** via Alert nativo (prevenção de deleções acidentais — importante em app de saúde)
- **Contador de caracteres** no formulário (limites visíveis para o usuário)
- **Empty state** informativo (guia o usuário sobre o que fazer)

### Extensibilidade

O design permite extensões sem refatoração:
- Novo sensor? Implemente `IVitalSignProvider`
- Trocar banco? Implemente `ISymptomRepository`
- Nova funcionalidade? Adicione Use Case + tela, o container conecta
- Dark mode? Modifique `theme/colors.ts`
- Testes? Injete mocks via `ServiceProvider` nos testes

---

## 📝 Licença

MIT
