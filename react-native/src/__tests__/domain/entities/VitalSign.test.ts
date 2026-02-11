import { createVitalSign, VitalSign } from '../../../domain/entities/VitalSign';

describe('VitalSign Entity', () => {
  describe('createVitalSign', () => {
    it('deve criar um VitalSign válido com valores normais', () => {
      const timestamp = new Date('2026-02-10T12:00:00Z');
      const vital = createVitalSign(72, 5000, timestamp);

      expect(vital.heartRate).toBe(72);
      expect(vital.steps).toBe(5000);
      expect(vital.timestamp).toBe(timestamp);
    });

    it('deve usar timestamp atual quando não fornecido', () => {
      const before = new Date();
      const vital = createVitalSign(80, 100);
      const after = new Date();

      expect(vital.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(vital.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('deve criar objeto imutável (Object.freeze)', () => {
      const vital = createVitalSign(72, 5000);

      expect(() => {
        (vital as any).heartRate = 999;
      }).toThrow();
    });

    it('deve aceitar frequência cardíaca nos limites (0 e 300)', () => {
      expect(() => createVitalSign(0, 0)).not.toThrow();
      expect(() => createVitalSign(300, 0)).not.toThrow();
    });

    it('deve rejeitar frequência cardíaca negativa', () => {
      expect(() => createVitalSign(-1, 0)).toThrow(
        'Frequência cardíaca inválida: -1'
      );
    });

    it('deve rejeitar frequência cardíaca acima de 300', () => {
      expect(() => createVitalSign(301, 0)).toThrow(
        'Frequência cardíaca inválida: 301'
      );
    });

    it('deve rejeitar contagem de passos negativa', () => {
      expect(() => createVitalSign(72, -1)).toThrow(
        'Contagem de passos inválida: -1'
      );
    });

    it('deve aceitar zero passos', () => {
      const vital = createVitalSign(72, 0);
      expect(vital.steps).toBe(0);
    });
  });

  describe('imutabilidade da interface', () => {
    it('deve ter campos readonly no tipo', () => {
      const vital: VitalSign = createVitalSign(72, 100);

      // TypeScript garante que os campos são readonly em tempo de compilação.
      // Este teste valida a imutabilidade em runtime via Object.freeze.
      expect(Object.isFrozen(vital)).toBe(true);
    });
  });
});

