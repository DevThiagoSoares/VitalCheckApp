/**
 * Mock do AsyncStorage para ambiente de testes.
 *
 * Simula o comportamento do AsyncStorage em memória,
 * permitindo testes do data layer sem dependência do ambiente React Native.
 */
const store: Record<string, string> = {};

const AsyncStorage = {
  getItem: jest.fn(async (key: string) => store[key] ?? null),

  setItem: jest.fn(async (key: string, value: string) => {
    store[key] = value;
  }),

  removeItem: jest.fn(async (key: string) => {
    delete store[key];
  }),

  clear: jest.fn(async () => {
    Object.keys(store).forEach((key) => delete store[key]);
  }),
};

export default AsyncStorage;

