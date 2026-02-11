import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SymptomLogScreen } from '../screens/SymptomLogScreen';
import { Colors } from '../theme/colors';

/**
 * Tipagem das rotas do Tab Navigator.
 *
 * Utilizar tipagem estrita para navegação previne erros
 * de rota em tempo de compilação.
 */
export type RootTabParamList = {
  Dashboard: undefined;
  SymptomLog: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * Navegador principal da aplicação.
 *
 * Utiliza Bottom Tab Navigator — padrão consolidado em apps de saúde
 * por oferecer acesso rápido às funcionalidades principais com um toque.
 *
 * Ícones: @expo/vector-icons (Ionicons) — biblioteca de ícones vetoriais
 * bundled com Expo, oferece ícones nítidos em qualquer densidade de tela.
 * Emojis foram substituídos por ícones por consistência cross-platform
 * (emojis renderizam diferente entre Android e iOS).
 *
 * Tab bar: o height fixo foi removido para que o React Navigation
 * calcule automaticamente a altura considerando safe area insets
 * do dispositivo (home indicator no iPhone X+, navigation bar no Android).
 */
export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SymptomLog"
        component={SymptomLogScreen}
        options={{
          tabBarLabel: 'Sintomas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: 6,
    /**
     * Sem height fixo em nenhuma plataforma — o React Navigation
     * calcula automaticamente a altura somando conteúdo + safe area
     * bottom inset. Isso resolve labels cortados em dispositivos com
     * home indicator (iPhone X+) e navigation gestual (Android 10+).
     */
    paddingBottom: Platform.OS === 'ios' ? 4 : 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: Platform.OS === 'ios' ? 0 : 6,
  },
  tabIcon: {
    marginTop: 2,
  },
});
