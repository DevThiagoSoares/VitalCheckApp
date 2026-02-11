package com.vitalcheck.app.presentation.theme

import androidx.compose.ui.graphics.Color

/**
 * Paleta de cores do VitalCheck — idêntica à versão React Native.
 *
 * Cores organizadas por função semântica, não por tom visual.
 * Facilita futura implementação de dark mode (basta criar outra paleta).
 */
object VitalColors {
    // Primárias
    val Primary = Color(0xFF4A90D9)
    val PrimaryDark = Color(0xFF357ABD)
    val PrimaryLight = Color(0xFF7FB3E6)

    // Semânticas (saúde)
    val HeartRate = Color(0xFFE74C3C)
    val HeartRateLight = Color(0xFFFDEDEC)
    val Steps = Color(0xFF27AE60)
    val StepsLight = Color(0xFFEAFAF1)

    // Neutras
    val Background = Color(0xFFF5F7FA)
    val Surface = Color(0xFFFFFFFF)
    val TextPrimary = Color(0xFF2C3E50)
    val TextSecondary = Color(0xFF7F8C8D)
    val TextTertiary = Color(0xFFBDC3C7)

    // Feedback
    val Error = Color(0xFFE74C3C)
    val ErrorLight = Color(0xFFFDEDEC)
    val Success = Color(0xFF27AE60)

    // Bordas
    val Border = Color(0xFFE8ECF0)
    val Divider = Color(0xFFF0F2F5)
}

