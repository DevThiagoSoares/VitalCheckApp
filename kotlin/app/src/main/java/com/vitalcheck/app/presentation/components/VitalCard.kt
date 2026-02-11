package com.vitalcheck.app.presentation.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.NumberFormat
import java.util.Locale

/**
 * Card para exibição de um indicador vital.
 *
 * Inclui animação de pulse (escala 1→1.04→1) quando o valor muda,
 * replicando o comportamento da versão React Native.
 *
 * Layout:
 * ┌─────────────────┐
 * │ ♥ FREQ. CARDÍACA│
 * │                  │
 * │      72 bpm      │
 * └─────────────────┘
 */
@Composable
fun VitalCard(
    title: String,
    value: Int,
    unit: String,
    icon: ImageVector,
    accentColor: Color,
    backgroundColor: Color,
    modifier: Modifier = Modifier
) {
    val scale = remember { Animatable(1f) }
    var previousValue by remember { mutableIntStateOf(value) }

    // Animação de pulse quando o valor muda
    LaunchedEffect(value) {
        if (previousValue != value) {
            previousValue = value
            scale.animateTo(1.04f, animationSpec = tween(120))
            scale.animateTo(1f, animationSpec = tween(180))
        }
    }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .scale(scale.value),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Header: ícone + título
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = accentColor
                )
                Text(
                    text = title.uppercase(),
                    color = accentColor,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 0.5.sp
                )
            }

            // Valor + unidade
            Row(
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = NumberFormat.getNumberInstance(Locale("pt", "BR")).format(value),
                    color = accentColor,
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = unit,
                    color = accentColor.copy(alpha = 0.7f),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
            }
        }
    }
}

