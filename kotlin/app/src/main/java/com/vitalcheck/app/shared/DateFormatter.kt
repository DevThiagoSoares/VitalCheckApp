package com.vitalcheck.app.shared

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

/**
 * Utilitário para formatação relativa de datas em português brasileiro.
 *
 * Equivalente ao dateFormatter.ts da versão React Native.
 * Exibe tempos relativos ("Agora", "Há 5 min", "Há 2 h") para
 * leituras recentes e data/hora completa para registros antigos.
 */
object DateFormatter {

    private val fullFormat = SimpleDateFormat("dd/MM/yyyy 'às' HH:mm", Locale("pt", "BR"))

    fun formatRelative(timestamp: Long): String {
        val now = System.currentTimeMillis()
        val diffMs = now - timestamp

        val seconds = TimeUnit.MILLISECONDS.toSeconds(diffMs)
        val minutes = TimeUnit.MILLISECONDS.toMinutes(diffMs)
        val hours = TimeUnit.MILLISECONDS.toHours(diffMs)

        return when {
            seconds < 30 -> "Agora"
            minutes < 1 -> "Há ${seconds}s"
            minutes < 60 -> "Há ${minutes} min"
            hours < 24 -> "Há ${hours}h"
            else -> fullFormat.format(Date(timestamp))
        }
    }
}

