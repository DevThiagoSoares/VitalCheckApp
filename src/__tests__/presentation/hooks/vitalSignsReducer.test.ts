import { createVitalSign } from '../../../domain/entities/VitalSign';
import {
    initialVitalSignsState,
    vitalSignsReducer,
    VitalSignsState,
} from '../../../presentation/reducers/vitalSignsReducer';

/**
 * Testes do reducer de sinais vitais.
 *
 * Demonstra a vantagem do useReducer com reducer extraído:
 * função pura testável sem hooks, React, mocks ou setup complexo.
 */
describe('vitalSignsReducer', () => {
  it('deve retornar estado inicial correto', () => {
    expect(initialVitalSignsState).toEqual({
      currentReading: null,
      isLoading: true,
      error: null,
    });
  });

  it('DATA_RECEIVED deve atualizar leitura e limpar loading/erro', () => {
    const reading = createVitalSign(72, 5000);
    const stateWithError: VitalSignsState = {
      currentReading: null,
      isLoading: true,
      error: 'Algum erro',
    };

    const newState = vitalSignsReducer(stateWithError, {
      type: 'DATA_RECEIVED',
      payload: reading,
    });

    expect(newState.currentReading).toBe(reading);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
  });

  it('ERROR deve definir mensagem de erro e parar loading', () => {
    const newState = vitalSignsReducer(initialVitalSignsState, {
      type: 'ERROR',
      payload: 'Falha no sensor',
    });

    expect(newState.error).toBe('Falha no sensor');
    expect(newState.isLoading).toBe(false);
    expect(newState.currentReading).toBeNull();
  });

  it('ERROR deve preservar leitura existente', () => {
    const reading = createVitalSign(80, 100);
    const state: VitalSignsState = {
      currentReading: reading,
      isLoading: false,
      error: null,
    };

    const newState = vitalSignsReducer(state, {
      type: 'ERROR',
      payload: 'Erro',
    });

    expect(newState.currentReading).toBe(reading);
    expect(newState.error).toBe('Erro');
  });

  it('RETRY deve resetar para estado inicial', () => {
    const dirtyState: VitalSignsState = {
      currentReading: createVitalSign(80, 100),
      isLoading: false,
      error: 'Erro antigo',
    };

    const newState = vitalSignsReducer(dirtyState, { type: 'RETRY' });

    expect(newState).toEqual(initialVitalSignsState);
  });

  it('deve retornar estado atual para action desconhecida', () => {
    const state = { ...initialVitalSignsState, isLoading: false };
    const newState = vitalSignsReducer(state, { type: 'UNKNOWN' } as any);

    expect(newState).toBe(state);
  });
});
