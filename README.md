# VitalCheck App

Aplicação mobile de diário inteligente de saúde — monitoramento de indicadores vitais e registro de sintomas com persistência local.

**Duas implementações lado a lado** com a mesma arquitetura (Clean Architecture + MVVM), mesma interface visual e mesmos requisitos, demonstrando domínio em ambas as plataformas.

---

## 📁 Estrutura do Repositório

```
vital-check-app/
├── react-native/      # Implementação cross-platform (Expo + TypeScript)
├── kotlin/            # Implementação nativa Android (Kotlin + Jetpack Compose)
└── README.md          # Este arquivo
```

---

## 🔀 Comparação das Implementações

| Aspecto | React Native | Kotlin / Android |
|---------|-------------|-----------------|
| **Linguagem** | TypeScript (strict) | Kotlin |
| **UI Framework** | React Native + Expo | Jetpack Compose (Material 3) |
| **Arquitetura** | Clean Architecture + MVVM (hooks + reducers) | Clean Architecture + MVVM (ViewModel + StateFlow) |
| **Persistência** | AsyncStorage (key-value) | Room (SQLite com tipagem em compilação) |
| **Reatividade** | useReducer + useEffect + callbacks | Flow + StateFlow + coroutines |
| **DI** | ServiceContainer + React Context | ServiceContainer + CompositionLocal |
| **Navegação** | @react-navigation/bottom-tabs | Navigation Compose |
| **Testes** | Jest + @testing-library | JUnit + MockK + Turbine |
| **Ícones** | @expo/vector-icons (Ionicons) | Material Icons Extended |
| **Haptics** | expo-haptics | HapticFeedbackConstants |
| **Animações** | Animated API (pulse) | Animatable (Compose) |

### Paridade de Funcionalidades

Ambas as implementações incluem:
- ✅ Dashboard com frequência cardíaca e passos (mock provider)
- ✅ Diário de sintomas (CRUD completo)
- ✅ Persistência local abstraída por repositórios
- ✅ Validação de domínio fail-fast nas entidades
- ✅ Animação de pulse nos cards quando valores atualizam
- ✅ Feedback háptico ao salvar sintomas
- ✅ Confirmação de exclusão com dialog
- ✅ Banner de erro não-bloqueante com auto-dismiss
- ✅ Estado vazio informativo
- ✅ Testes unitários (domínio, data, apresentação)

---

## ▶️ Executar cada Projeto

### React Native (Expo)

```bash
cd react-native
npm install
npx expo start
```

Escaneie o QR code com **Expo Go** (celular) ou pressione `a` para abrir no emulador Android.

📖 Documentação completa: [`react-native/README.md`](react-native/README.md)

### Kotlin / Android

**Via Android Studio (recomendado):**
1. `File → Open` → selecionar a pasta `kotlin/`
2. Aguardar Gradle Sync
3. `Tools → Device Manager` → criar ou iniciar emulador
4. **▶ Run 'app'**

**Via terminal:**
```bash
cd kotlin
./gradlew assembleDebug      # compilar
./gradlew installDebug       # instalar no emulador/dispositivo
```

📖 Documentação completa: [`kotlin/README.md`](kotlin/README.md)

---

## 📐 Decisão Arquitetural Compartilhada

### Por que implementar nas duas plataformas?

1. **Demonstração de versatilidade**: A mesma arquitetura (Clean Architecture) se traduz naturalmente para ambos os ecossistemas
2. **Comparação direta**: Permite avaliar como conceitos universais (DI, Repository, Use Case) se materializam em TypeScript vs Kotlin
3. **Trade-offs visíveis**: Cada implementação evidencia os pontos fortes da plataforma

### Mapeamento de Conceitos

| Conceito | React Native | Kotlin |
|----------|-------------|--------|
| ViewModel | Custom Hook (`useVitalSigns`) | `ViewModel` (`VitalSignsViewModel`) |
| Estado Reativo | `useReducer` → state | `StateFlow` → `collectAsStateWithLifecycle` |
| Streams | Callbacks com cleanup | Kotlin Flow (cold streams) |
| Imutabilidade | `Object.freeze` + `readonly` | `data class` + `val` |
| Validação | `Error` no factory | `require()` no `init` block |
| Ciclo de vida | `useEffect` cleanup | `viewModelScope` (cancellation) |
| DI Container | React Context | CompositionLocal |
| Testes de Flow | Jest + callbacks | Turbine + `runTest` |

---

## 🧠 Uso de IA e Ética

A IA (Claude/Cursor) foi utilizada como **ferramenta de aceleração**, não como substituto de decisões de engenharia:

- **Decisões arquiteturais**: Tomadas pelo engenheiro humano
- **Scaffolding**: Acelerado por IA, revisado e ajustado
- **Testes**: Cenários co-criados, relevância validada pelo humano
- **Documentação**: Co-criada, revisada para precisão técnica

Cada decisão pode ser explicada e justificada — não há "caixa preta". Detalhes completos em cada `README.md` dos subprojetos.

---

## 📝 Licença

MIT
