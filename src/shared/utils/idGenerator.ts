import * as Crypto from 'expo-crypto';

/**
 * Gera um UUID v4 utilizando o módulo expo-crypto.
 *
 * Escolha: expo-crypto ao invés da lib `uuid` porque:
 * - Já faz parte do ecossistema Expo (zero dependência adicional)
 * - Utiliza gerador criptográfico nativo do dispositivo
 * - Evita polyfills de crypto para React Native
 */
export function generateId(): string {
  return Crypto.randomUUID();
}

