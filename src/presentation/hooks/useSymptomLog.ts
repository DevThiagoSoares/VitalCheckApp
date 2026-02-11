import { useCallback, useEffect, useReducer } from 'react';
import { useServices } from '../../di/ServiceContext';
import {
  initialSymptomLogState,
  symptomLogReducer,
} from '../reducers/symptomLogReducer';

/**
 * Hook (ViewModel) para o diário de sintomas.
 *
 * Gerencia o estado completo do log de sintomas via useReducer:
 * - Carregamento do histórico
 * - Criação de novos registros
 * - Exclusão de registros
 * - Tratamento de erros
 *
 * O reducer é extraído em arquivo separado para testabilidade
 * independente (função pura sem dependência de React).
 *
 * Todas as operações assíncronas disparam actions no reducer,
 * mantendo o fluxo de dados unidirecional e previsível.
 */
export function useSymptomLog() {
  const { createSymptomEntry, getSymptomHistory, deleteSymptomEntry } = useServices();
  const [state, dispatch] = useReducer(symptomLogReducer, initialSymptomLogState);

  const loadEntries = useCallback(async () => {
    try {
      dispatch({ type: 'LOAD_START' });
      const entries = await getSymptomHistory.execute();
      dispatch({ type: 'LOAD_SUCCESS', payload: entries });
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: err instanceof Error ? err.message : 'Erro ao carregar histórico',
      });
    }
  }, [getSymptomHistory]);

  const addEntry = useCallback(
    async (description: string): Promise<boolean> => {
      try {
        dispatch({ type: 'SAVE_START' });
        const newEntry = await createSymptomEntry.execute(description);
        dispatch({ type: 'SAVE_SUCCESS', payload: newEntry });
        return true;
      } catch (err) {
        dispatch({
          type: 'SAVE_ERROR',
          payload: err instanceof Error ? err.message : 'Erro ao salvar sintoma',
        });
        return false;
      }
    },
    [createSymptomEntry]
  );

  const removeEntry = useCallback(
    async (id: string): Promise<void> => {
      try {
        await deleteSymptomEntry.execute(id);
        dispatch({ type: 'DELETE_SUCCESS', payload: id });
      } catch (err) {
        dispatch({
          type: 'DELETE_ERROR',
          payload: err instanceof Error ? err.message : 'Erro ao remover sintoma',
        });
      }
    },
    [deleteSymptomEntry]
  );

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Carrega histórico ao montar
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return {
    ...state,
    addEntry,
    removeEntry,
    refreshEntries: loadEntries,
    clearError,
  };
}
