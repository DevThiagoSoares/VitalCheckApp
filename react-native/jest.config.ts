import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // Ignora arquivos .tsx nos testes de domínio/data (apenas lógica pura)
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // Mock automático de módulos nativos que não existem no ambiente Node
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/src/__tests__/__mocks__/asyncStorage.ts',
    '^expo-crypto$': '<rootDir>/src/__tests__/__mocks__/expoCrypto.ts',
  },
};

export default config;

