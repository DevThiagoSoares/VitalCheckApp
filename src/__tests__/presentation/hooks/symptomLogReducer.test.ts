import { SymptomEntry } from '../../../domain/entities/SymptomEntry';
import {
    initialSymptomLogState,
    symptomLogReducer,
    SymptomLogState,
} from '../../../presentation/reducers/symptomLogReducer';

const mockEntry = (id: string, desc: string): SymptomEntry =>
  Object.freeze({
    id,
    description: desc,
    timestamp: new Date('2026-02-10T12:00:00Z'),
  });

/**
 * Testes do reducer do diário de sintomas.
 *
 * Cada action type é testada isoladamente, garantindo
 * que as transições de estado são corretas e previsíveis.
 * O reducer é função pura — testável sem React ou mocks.
 */
describe('symptomLogReducer', () => {
  describe('LOAD_*', () => {
    it('LOAD_START deve ativar loading e limpar erro', () => {
      const state: SymptomLogState = {
        ...initialSymptomLogState,
        error: 'Erro antigo',
        isLoading: false,
      };
      const newState = symptomLogReducer(state, { type: 'LOAD_START' });

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('LOAD_SUCCESS deve popular entries e desativar loading', () => {
      const entries = [mockEntry('1', 'Dor'), mockEntry('2', 'Febre')];
      const newState = symptomLogReducer(initialSymptomLogState, {
        type: 'LOAD_SUCCESS',
        payload: entries,
      });

      expect(newState.entries).toEqual(entries);
      expect(newState.isLoading).toBe(false);
    });

    it('LOAD_ERROR deve definir erro e desativar loading', () => {
      const newState = symptomLogReducer(initialSymptomLogState, {
        type: 'LOAD_ERROR',
        payload: 'Falha no storage',
      });

      expect(newState.error).toBe('Falha no storage');
      expect(newState.isLoading).toBe(false);
    });
  });

  describe('SAVE_*', () => {
    it('SAVE_START deve ativar saving e limpar erro', () => {
      const newState = symptomLogReducer(initialSymptomLogState, { type: 'SAVE_START' });

      expect(newState.isSaving).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('SAVE_SUCCESS deve inserir entry no início da lista', () => {
      const existing = mockEntry('old', 'Antigo');
      const newEntry = mockEntry('new', 'Novo');
      const state: SymptomLogState = { ...initialSymptomLogState, entries: [existing] };

      const newState = symptomLogReducer(state, {
        type: 'SAVE_SUCCESS',
        payload: newEntry,
      });

      expect(newState.entries).toHaveLength(2);
      expect(newState.entries[0].id).toBe('new');
      expect(newState.entries[1].id).toBe('old');
      expect(newState.isSaving).toBe(false);
    });

    it('SAVE_ERROR deve definir erro e desativar saving', () => {
      const state: SymptomLogState = { ...initialSymptomLogState, isSaving: true };
      const newState = symptomLogReducer(state, {
        type: 'SAVE_ERROR',
        payload: 'Erro ao salvar',
      });

      expect(newState.error).toBe('Erro ao salvar');
      expect(newState.isSaving).toBe(false);
    });
  });

  describe('DELETE_*', () => {
    it('DELETE_SUCCESS deve remover entry pelo ID', () => {
      const state: SymptomLogState = {
        ...initialSymptomLogState,
        entries: [
          mockEntry('1', 'Manter'),
          mockEntry('2', 'Remover'),
          mockEntry('3', 'Manter'),
        ],
      };

      const newState = symptomLogReducer(state, {
        type: 'DELETE_SUCCESS',
        payload: '2',
      });

      expect(newState.entries).toHaveLength(2);
      expect(newState.entries.find((e) => e.id === '2')).toBeUndefined();
    });

    it('DELETE_ERROR deve definir erro sem alterar entries', () => {
      const entries = [mockEntry('1', 'Dor')];
      const state: SymptomLogState = { ...initialSymptomLogState, entries };

      const newState = symptomLogReducer(state, {
        type: 'DELETE_ERROR',
        payload: 'Erro ao deletar',
      });

      expect(newState.error).toBe('Erro ao deletar');
      expect(newState.entries).toEqual(entries);
    });
  });

  describe('CLEAR_ERROR', () => {
    it('deve limpar erro mantendo o resto do estado', () => {
      const entries = [mockEntry('1', 'Dor')];
      const state: SymptomLogState = {
        ...initialSymptomLogState,
        entries,
        error: 'Algum erro',
        isLoading: false,
      };

      const newState = symptomLogReducer(state, { type: 'CLEAR_ERROR' });

      expect(newState.error).toBeNull();
      expect(newState.entries).toEqual(entries);
      expect(newState.isLoading).toBe(false);
    });
  });

  it('deve retornar estado atual para action desconhecida', () => {
    const state = { ...initialSymptomLogState };
    const newState = symptomLogReducer(state, { type: 'UNKNOWN' } as any);

    expect(newState).toBe(state);
  });
});
