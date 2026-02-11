package com.vitalcheck.app.presentation.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.DirectionsWalk
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.vitalcheck.app.presentation.components.ErrorBanner
import com.vitalcheck.app.presentation.components.VitalCard
import com.vitalcheck.app.presentation.theme.LocalServiceContainer
import com.vitalcheck.app.presentation.theme.VitalColors
import com.vitalcheck.app.presentation.viewmodel.VitalSignsViewModel
import com.vitalcheck.app.shared.DateFormatter

/**
 * Tela principal: Dashboard de Sinais Vitais.
 *
 * Puramente declarativa — toda lógica está no VitalSignsViewModel.
 * Coleta estado via collectAsStateWithLifecycle (lifecycle-aware).
 *
 * Layout replica fielmente a versão React Native:
 * - Header com título
 * - Cards de frequência cardíaca e passos lado a lado
 * - Status de atualização
 * - Info banner sobre dados simulados
 */
@Composable
fun DashboardScreen() {
    val container = LocalServiceContainer.current
    val viewModel: VitalSignsViewModel = viewModel(
        factory = VitalSignsViewModel.factory(container)
    )
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VitalColors.Background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Header
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "VitalCheck",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = VitalColors.TextPrimary
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Seus sinais vitais em tempo real",
            fontSize = 15.sp,
            color = VitalColors.TextSecondary
        )
        Spacer(modifier = Modifier.height(24.dp))

        // Erro
        state.error?.let { error ->
            ErrorBanner(
                message = error,
                onDismiss = { viewModel.retry() }
            )
        }

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
                    text = "Conectando aos sensores...",
                    fontSize = 14.sp,
                    color = VitalColors.TextSecondary
                )
            }
        }

        // Cards de sinais vitais
        state.currentReading?.let { reading ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                VitalCard(
                    title = "Freq. Cardíaca",
                    value = reading.heartRate,
                    unit = "bpm",
                    icon = Icons.Filled.Favorite,
                    accentColor = VitalColors.HeartRate,
                    backgroundColor = VitalColors.HeartRateLight,
                    modifier = Modifier.weight(1f)
                )
                VitalCard(
                    title = "Passos",
                    value = reading.steps,
                    unit = "passos",
                    icon = Icons.Outlined.DirectionsWalk,
                    accentColor = VitalColors.Steps,
                    backgroundColor = VitalColors.StepsLight,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Status de atualização
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(VitalColors.Success)
                )
                Text(
                    text = "  Atualizado: ${DateFormatter.formatRelative(reading.timestamp)}",
                    fontSize = 13.sp,
                    color = VitalColors.TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Info sobre dados simulados
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = VitalColors.Surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Info,
                        contentDescription = "Informação",
                        tint = VitalColors.TextSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = "Os dados exibidos são simulados. Em uma versão de produção, " +
                            "estes valores seriam obtidos de sensores reais via Google Fit " +
                            "ou Apple HealthKit.",
                        fontSize = 13.sp,
                        color = VitalColors.TextSecondary,
                        lineHeight = 19.sp
                    )
                }
            }
        }
    }
}

