package com.vitalcheck.app.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vitalcheck.app.presentation.theme.VitalColors
import kotlinx.coroutines.delay

/**
 * Banner de erro não-bloqueante com auto-dismiss.
 *
 * Exibe mensagens de erro com borda lateral vermelha,
 * ícone de alerta e botão de fechar — mesmo layout da versão RN.
 * Auto-dismiss após 5 segundos via LaunchedEffect.
 */
@Composable
fun ErrorBanner(
    message: String,
    onDismiss: () -> Unit,
    autoDismissMs: Long = 5000L,
    modifier: Modifier = Modifier
) {
    // Auto-dismiss
    LaunchedEffect(message) {
        delay(autoDismissMs)
        onDismiss()
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(bottom = 16.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(VitalColors.ErrorLight)
            .drawBehind {
                // Borda lateral esquerda
                drawLine(
                    color = VitalColors.Error,
                    start = Offset(0f, 0f),
                    end = Offset(0f, size.height),
                    strokeWidth = 3.dp.toPx()
                )
            }
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Icon(
            imageVector = Icons.Filled.Error,
            contentDescription = "Erro",
            tint = VitalColors.Error,
            modifier = Modifier.size(18.dp)
        )

        Text(
            text = message,
            color = VitalColors.Error,
            fontSize = 13.sp,
            lineHeight = 18.sp,
            maxLines = 2,
            modifier = Modifier.weight(1f)
        )

        IconButton(
            onClick = onDismiss,
            modifier = Modifier.size(24.dp)
        ) {
            Icon(
                imageVector = Icons.Filled.Close,
                contentDescription = "Fechar erro",
                tint = VitalColors.Error,
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

