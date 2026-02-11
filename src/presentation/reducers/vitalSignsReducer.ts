import { VitalSign } from '../../domain/entities/VitalSign';

// --- State ---

export interface VitalSignsState {
  currentReading: VitalSign | null;
  isLoading: boolean;
  error: string | null;
}

export const initialVitalSignsState: VitalSignsState = {
  currentReading: null,
  isLoading: true,
  error: null,
};

// --- Actions (Discriminated Union) ---

export type VitalSignsAction =
  | { type: 'DATA_RECEIVED'; payload: VitalSign }
  | { type: 'ERROR'; payload: string }
  | { type: 'RETRY' };

/**
 * Reducer puro para estado dos sinais vitais.
 *
 * Vantagens do useReducer sobre useState para estados complexos:
 * - Transições de estado explícitas e rastreáveis
 * - Mais fácil de testar (função pura, sem dependência de React)
 * - Estado sempre consistente (sem partial updates)
 * - Padrão familiar para quem vem de Redux/Flux
 */
export function vitalSignsReducer(
  state: VitalSignsState,
  action: VitalSignsAction
): VitalSignsState {
  switch (action.type) {
    case 'DATA_RECEIVED':
      return {
        currentReading: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'RETRY':
      return initialVitalSignsState;
    default:
      return state;
  }
}

