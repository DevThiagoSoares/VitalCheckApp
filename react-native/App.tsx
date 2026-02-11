import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { ServiceProvider } from './src/di/ServiceContext';
import { container } from './src/di/ServiceContainer';

/**
 * Componente raiz da aplicação VitalCheck.
 *
 * Responsabilidades do App root:
 * 1. Configurar provedores globais (DI, Navigation, SafeArea)
 * 2. Inicializar o container de serviços
 * 3. Delegar toda lógica de UI ao AppNavigator
 *
 * Ordem dos providers (de fora para dentro):
 * - SafeAreaProvider: gerencia insets de área segura
 * - ServiceProvider: injeção de dependência via Context
 * - NavigationContainer: gerencia o estado de navegação
 *
 * O container de serviços é instanciado uma única vez (singleton)
 * e provido a toda a árvore de componentes.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ServiceProvider container={container}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </ServiceProvider>
    </SafeAreaProvider>
  );
}
