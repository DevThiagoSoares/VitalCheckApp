/**
 * Mock do expo-crypto para ambiente de testes.
 */
let counter = 0;

export function randomUUID(): string {
  counter++;
  return `mock-uuid-${counter}`;
}

/**
 * Reseta o counter para testes isolados.
 */
export function __resetCounter(): void {
  counter = 0;
}

