import { useCallback, useEffect, useReducer } from 'react';
import { useServices } from '../../di/ServiceContext';
import {
  initialVitalSignsState,
  vitalSignsReducer,
} from '../reducers/vitalSignsReducer';

/**
 * Hook (ViewModel) para o monitoramento de sinais vitais.
 *
 * Encapsula toda a lógica de estado e side-effects relacionados
 * à observação de sinais vitais. A tela (View) apenas consome
 * o estado e chama ações — não contém lógica de negócio.
 *
 * Padrão: MVVM via custom hook — idiomático em React, equivalente
 * funcional ao ViewModel do Android Architecture Components.
 *
 * Utiliza useReducer com reducer extraído:
 * - Transições de estado previsíveis via actions tipadas
 * - Reducer testável isoladamente (função pura, arquivo separado)
 * - Consistência em cenários concorrentes
 */
export function useVitalSigns() {
  const { observeVitalSigns } = useServices();
  const [state, dispatch] = useReducer(vitalSignsReducer, initialVitalSignsState);

  useEffect(() => {
    let isMounted = true;

    try {
      const unsubscribe = observeVitalSigns.execute((vitalSign) => {
        if (isMounted) {
          dispatch({ type: 'DATA_RECEIVED', payload: vitalSign });
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      if (isMounted) {
        dispatch({
          type: 'ERROR',
          payload: err instanceof Error ? err.message : 'Erro ao observar sinais vitais',
        });
      }
    }
  }, [observeVitalSigns]);

  const retry = useCallback(() => {
    dispatch({ type: 'RETRY' });
  }, []);

  return {
    ...state,
    retry,
  };
}
