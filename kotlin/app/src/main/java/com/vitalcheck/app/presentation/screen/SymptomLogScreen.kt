package com.vitalcheck.app.presentation.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Assignment
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.vitalcheck.app.presentation.components.EmptyState
import com.vitalcheck.app.presentation.components.ErrorBanner
import com.vitalcheck.app.presentation.components.SymptomForm
import com.vitalcheck.app.presentation.components.SymptomItem
import com.vitalcheck.app.presentation.theme.LocalServiceContainer
import com.vitalcheck.app.presentation.theme.VitalColors
import com.vitalcheck.app.presentation.viewmodel.SymptomLogViewModel

/**
 * Tela de Diário de Sintomas.
 *
 * Layout replica fielmente a versão React Native:
 * - Header com título
 * - Formulário de entrada
 * - Lista de registros com contagem
 * - Empty state quando não há registros
 *
 * LazyColumn equivale ao FlatList do React Native —
 * renderiza apenas itens visíveis para performance.
 */
@Composable
fun SymptomLogScreen() {
    val container = LocalServiceContainer.current
    val viewModel: SymptomLogViewModel = viewModel(
        factory = SymptomLogViewModel.factory(container)
    )
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VitalColors.Background)
    ) {
        // Header (não scrollável)
        Column(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Text(
                text = "Diário de Sintomas",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = VitalColors.TextPrimary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Registre como você está se sentindo",
                fontSize = 15.sp,
                color = VitalColors.TextSecondary
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Erro
        state.error?.let { error ->
            ErrorBanner(
                message = error,
                onDismiss = { viewModel.clearError() },
                modifier = Modifier.padding(horizontal = 16.dp)
            )
        }

        // Formulário
        SymptomForm(
            onSubmit = { description -> viewModel.addEntry(description) },
            isSaving = state.isSaving,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Loading
        if (state.isLoading) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 96.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                CircularProgressIndicator(color = VitalColors.Primary)
                Text(
                    text = "Carregando histórico...",
                    fontSize = 14.sp,
                    color = VitalColors.TextSecondary
                )
            }
        } else {
            // Lista de sintomas
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    horizontal = 16.dp,
                    vertical = 4.dp
                )
            ) {
                // Header da lista
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp, top = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Histórico",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = VitalColors.TextPrimary
                        )
                        Text(
                            text = "${state.entries.size} ${
                                if (state.entries.size == 1) "registro" else "registros"
                            }",
                            fontSize = 13.sp,
                            color = VitalColors.TextSecondary
                        )
                    }
                }

                if (state.entries.isEmpty()) {
                    item {
                        EmptyState(
                            icon = Icons.Outlined.Assignment,
                            title = "Nenhum sintoma registrado",
                            subtitle = "Use o campo acima para registrar como você está se sentindo."
                        )
                    }
                } else {
                    items(
                        items = state.entries,
                        key = { it.id }
                    ) { entry ->
                        SymptomItem(
                            entry = entry,
                            onDelete = { id -> viewModel.removeEntry(id) }
                        )
                    }
                }
            }
        }
    }
}

