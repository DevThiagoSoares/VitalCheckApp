package com.vitalcheck.app.data.datasource

import com.vitalcheck.app.domain.entity.VitalSign
import com.vitalcheck.app.domain.repository.IVitalSignProvider
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlin.random.Random

/**
 * Provedor simulado de sinais vitais.
 *
 * Gera leituras realistas com variação gaussiana para frequência cardíaca
 * e incremento monotônico para passos — mesmo comportamento da versão
 * React Native (MockVitalSignProvider.ts).
 *
 * Utiliza Kotlin Flow (cold stream) com delay() — equivalente ao
 * setInterval + callback da versão RN, mas com cancelamento automático
 * via structured concurrency.
 *
 * @param intervalMs Intervalo entre emissões em milissegundos
 */
class MockVitalSignProvider(
    private val intervalMs: Long = 3000L
) : IVitalSignProvider {

    private var currentHeartRate = 72
    private var currentSteps = 0

    override fun observeVitalSigns(): Flow<VitalSign> = flow {
        while (true) {
            val reading = generateReading()
            emit(reading)
            delay(intervalMs)
        }
    }

    /**
     * Gera leitura com variação realista:
     * - Heart rate: variação de ±5 bpm (caminhada aleatória limitada a 60–100)
     * - Steps: incremento de 0–15 passos por ciclo
     */
    private fun generateReading(): VitalSign {
        val heartRateVariation = Random.nextInt(-5, 6)
        currentHeartRate = (currentHeartRate + heartRateVariation).coerceIn(60, 100)

        val stepIncrement = Random.nextInt(0, 16)
        currentSteps += stepIncrement

        return VitalSign(
            heartRate = currentHeartRate,
            steps = currentSteps,
            timestamp = System.currentTimeMillis()
        )
    }
}

