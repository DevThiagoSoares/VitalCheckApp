package com.vitalcheck.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.vitalcheck.app.di.ServiceContainer
import com.vitalcheck.app.domain.entity.VitalSign
import com.vitalcheck.app.domain.usecase.ObserveVitalSigns
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.launch

/**
 * Estado da UI para sinais vitais — equivalente ao VitalSignsState
 * do vitalSignsReducer.ts na versão React Native.
 *
 * Data class imutável + copy() fornece as mesmas garantias
 * do spread operator do TypeScript ({...state, field: value}).
 */
data class VitalSignsUiState(
    val currentReading: VitalSign? = null,
    val isLoading: Boolean = true,
    val error: String? = null
)

/**
 * ViewModel para o Dashboard de sinais vitais.
 *
 * Equivalente ao useVitalSigns hook da versão React Native.
 * Utiliza StateFlow (Kotlin) ao invés de useReducer (React).
 *
 * StateFlow é o padrão Android para estado observável:
 * - Lifecycle-aware (coleta automaticamente pausada/retomada)
 * - Conflation built-in (apenas último valor emitido é mantido)
 * - Thread-safe
 *
 * O Flow do provider é coletado no viewModelScope, que é cancelado
 * automaticamente quando o ViewModel é destruído — equivalente
 * ao cleanup do useEffect na versão RN.
 */
class VitalSignsViewModel(
    private val observeVitalSigns: ObserveVitalSigns
) : ViewModel() {

    private val _uiState = MutableStateFlow(VitalSignsUiState())
    val uiState: StateFlow<VitalSignsUiState> = _uiState.asStateFlow()

    init {
        startObserving()
    }

    private fun startObserving() {
        viewModelScope.launch {
            observeVitalSigns()
                .catch { e ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = e.message ?: "Erro ao observar sinais vitais"
                    )
                }
                .collect { vitalSign ->
                    _uiState.value = VitalSignsUiState(
                        currentReading = vitalSign,
                        isLoading = false,
                        error = null
                    )
                }
        }
    }

    fun retry() {
        _uiState.value = VitalSignsUiState()
        startObserving()
    }

    companion object {
        /**
         * Factory para criação do ViewModel com injeção manual.
         * Recebe o ServiceContainer e extrai o use case necessário.
         */
        fun factory(container: ServiceContainer): ViewModelProvider.Factory =
            viewModelFactory {
                initializer {
                    VitalSignsViewModel(container.observeVitalSigns)
                }
            }
    }
}

