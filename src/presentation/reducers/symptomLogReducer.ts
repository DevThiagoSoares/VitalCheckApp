import { SymptomEntry } from '../../domain/entities/SymptomEntry';

// --- State ---

export interface SymptomLogState {
  entries: SymptomEntry[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export const initialSymptomLogState: SymptomLogState = {
  entries: [],
  isLoading: true,
  isSaving: false,
  error: null,
};

// --- Actions (Discriminated Union) ---

export type SymptomLogAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: SymptomEntry[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; payload: SymptomEntry }
  | { type: 'SAVE_ERROR'; payload: string }
  | { type: 'DELETE_SUCCESS'; payload: string }
  | { type: 'DELETE_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

/**
 * Reducer puro para estado do diário de sintomas.
 *
 * Cada transição de estado é explícita via action type.
 * Função pura — testável isoladamente sem dependência de hooks ou React.
 */
export function symptomLogReducer(
  state: SymptomLogState,
  action: SymptomLogAction
): SymptomLogState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };

    case 'LOAD_SUCCESS':
      return { ...state, entries: action.payload, isLoading: false };

    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };

    case 'SAVE_START':
      return { ...state, isSaving: true, error: null };

    case 'SAVE_SUCCESS':
      return {
        ...state,
        entries: [action.payload, ...state.entries],
        isSaving: false,
      };

    case 'SAVE_ERROR':
      return { ...state, isSaving: false, error: action.payload };

    case 'DELETE_SUCCESS':
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      };

    case 'DELETE_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

