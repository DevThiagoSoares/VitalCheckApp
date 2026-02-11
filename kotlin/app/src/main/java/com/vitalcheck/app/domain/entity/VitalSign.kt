package com.vitalcheck.app.domain.entity

/**
 * Entidade imutável representando uma leitura de sinais vitais.
 *
 * Utiliza data class do Kotlin para imutabilidade nativa (val),
 * equals/hashCode automáticos, e copy() para transformações seguras.
 *
 * Validação fail-fast no companion object factory — impede criação
 * de instâncias inválidas em qualquer camada.
 *
 * @property heartRate Frequência cardíaca em bpm (0–300)
 * @property steps Contagem acumulada de passos (≥ 0)
 * @property timestamp Momento da leitura
 */
data class VitalSign(
    val heartRate: Int,
    val steps: Int,
    val timestamp: Long = System.currentTimeMillis()
) {
    init {
        require(heartRate in 0..300) {
            "Frequência cardíaca inválida: $heartRate. Deve estar entre 0 e 300 bpm."
        }
        require(steps >= 0) {
            "Contagem de passos inválida: $steps. Não pode ser negativa."
        }
    }
}

