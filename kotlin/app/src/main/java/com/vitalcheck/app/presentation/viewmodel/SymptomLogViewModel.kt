package com.vitalcheck.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.vitalcheck.app.di.ServiceContainer
import com.vitalcheck.app.domain.entity.SymptomEntry
import com.vitalcheck.app.domain.usecase.CreateSymptomEntry
import com.vitalcheck.app.domain.usecase.DeleteSymptomEntry
import com.vitalcheck.app.domain.usecase.GetSymptomHistory
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Estado da UI para o diário de sintomas — equivalente ao SymptomLogState
 * do symptomLogReducer.ts na versão React Native.
 */
data class SymptomLogUiState(
    val entries: List<SymptomEntry> = emptyList(),
    val isLoading: Boolean = true,
    val isSaving: Boolean = false,
    val error: String? = null
)

/**
 * ViewModel para o Diário de Sintomas.
 *
 * Equivalente ao useSymptomLog hook da versão React Native.
 * Gerencia todas as operações CRUD + estados de loading/erro.
 *
 * Cada operação é lançada no viewModelScope e atualiza o _uiState
 * com copy() — padrão equivalente ao dispatch de actions do reducer.
 */
class SymptomLogViewModel(
    private val createSymptomEntry: CreateSymptomEntry,
    private val getSymptomHistory: GetSymptomHistory,
    private val deleteSymptomEntry: DeleteSymptomEntry
) : ViewModel() {

    private val _uiState = MutableStateFlow(SymptomLogUiState())
    val uiState: StateFlow<SymptomLogUiState> = _uiState.asStateFlow()

    init {
        loadEntries()
    }

    private fun loadEntries() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val entries = getSymptomHistory()
                _uiState.value = _uiState.value.copy(
                    entries = entries,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Erro ao carregar histórico"
                )
            }
        }
    }

    fun addEntry(description: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSaving = true, error = null)
            try {
                val newEntry = createSymptomEntry(description)
                _uiState.value = _uiState.value.copy(
                    entries = listOf(newEntry) + _uiState.value.entries,
                    isSaving = false
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isSaving = false,
                    error = e.message ?: "Erro ao salvar sintoma"
                )
            }
        }
    }

    fun removeEntry(id: String) {
        viewModelScope.launch {
            try {
                deleteSymptomEntry(id)
                _uiState.value = _uiState.value.copy(
                    entries = _uiState.value.entries.filter { it.id != id }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = e.message ?: "Erro ao remover sintoma"
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun refresh() {
        loadEntries()
    }

    companion object {
        fun factory(container: ServiceContainer): ViewModelProvider.Factory =
            viewModelFactory {
                initializer {
                    SymptomLogViewModel(
                        createSymptomEntry = container.createSymptomEntry,
                        getSymptomHistory = container.getSymptomHistory,
                        deleteSymptomEntry = container.deleteSymptomEntry
                    )
                }
            }
    }
}

