import { createSymptomEntry } from '../../../domain/entities/SymptomEntry';

describe('SymptomEntry Entity', () => {
  describe('createSymptomEntry', () => {
    it('deve criar um SymptomEntry válido', () => {
      const timestamp = new Date('2026-02-10T15:00:00Z');
      const entry = createSymptomEntry('abc-123', 'Dor de cabeça leve', timestamp);

      expect(entry.id).toBe('abc-123');
      expect(entry.description).toBe('Dor de cabeça leve');
      expect(entry.timestamp).toBe(timestamp);
    });

    it('deve fazer trim na descrição', () => {
      const entry = createSymptomEntry('id-1', '  Dor de cabeça  ');
      expect(entry.description).toBe('Dor de cabeça');
    });

    it('deve criar objeto imutável', () => {
      const entry = createSymptomEntry('id-1', 'Tontura');

      expect(Object.isFrozen(entry)).toBe(true);
      expect(() => {
        (entry as any).description = 'Alterado';
      }).toThrow();
    });

    it('deve usar timestamp atual quando não fornecido', () => {
      const before = new Date();
      const entry = createSymptomEntry('id-1', 'Náusea');
      const after = new Date();

      expect(entry.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(entry.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('deve rejeitar descrição vazia', () => {
      expect(() => createSymptomEntry('id-1', '')).toThrow(
        'A descrição do sintoma não pode ser vazia'
      );
    });

    it('deve rejeitar descrição apenas com espaços', () => {
      expect(() => createSymptomEntry('id-1', '   ')).toThrow(
        'A descrição do sintoma não pode ser vazia'
      );
    });

    it('deve rejeitar descrição com mais de 500 caracteres', () => {
      const longDescription = 'A'.repeat(501);
      expect(() => createSymptomEntry('id-1', longDescription)).toThrow(
        'não pode exceder 500 caracteres'
      );
    });

    it('deve aceitar descrição com exatamente 500 caracteres', () => {
      const maxDescription = 'A'.repeat(500);
      const entry = createSymptomEntry('id-1', maxDescription);
      expect(entry.description.length).toBe(500);
    });

    it('deve rejeitar ID vazio', () => {
      expect(() => createSymptomEntry('', 'Dor')).toThrow(
        'O ID do sintoma não pode ser vazio'
      );
    });
  });
});

