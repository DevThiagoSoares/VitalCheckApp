package com.vitalcheck.app.domain.repository

import com.vitalcheck.app.domain.entity.VitalSign
import kotlinx.coroutines.flow.Flow

/**
 * Interface (porta) para provedores de sinais vitais.
 *
 * Utiliza Flow do Kotlin — o equivalente idiomático de Observable/Stream.
 * Flow é cold by default: só emite quando há um coletor ativo.
 *
 * Em produção, implementações reais integrariam com:
 * - Google Fit API
 * - Samsung Health SDK
 * - Sensores BLE (Bluetooth Low Energy)
 *
 * A interface garante que o domínio não depende da fonte de dados concreta.
 */
interface IVitalSignProvider {

    /**
     * Emite leituras de sinais vitais de forma contínua.
     * O Flow é cancelado automaticamente quando o coletor é destruído.
     */
    fun observeVitalSigns(): Flow<VitalSign>
}

