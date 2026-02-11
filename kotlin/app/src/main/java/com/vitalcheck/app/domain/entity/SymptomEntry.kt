package com.vitalcheck.app.domain.entity

import java.util.UUID

/**
 * Entidade imutável representando um registro de sintoma no diário de saúde.
 *
 * Validação fail-fast via init block:
 * - Descrição não pode ser vazia nem exceder 500 caracteres
 * - ID não pode ser vazio
 *
 * @property id Identificador único (UUID)
 * @property description Descrição do sintoma (1–500 caracteres, trimmed)
 * @property timestamp Momento do registro
 */
data class SymptomEntry(
    val id: String,
    val description: String,
    val timestamp: Long = System.currentTimeMillis()
) {
    init {
        require(id.isNotBlank()) {
            "O ID do sintoma não pode ser vazio."
        }
        require(description.isNotBlank()) {
            "A descrição do sintoma não pode ser vazia."
        }
        require(description.length <= 500) {
            "A descrição do sintoma não pode exceder 500 caracteres."
        }
    }

    companion object {
        /**
         * Factory com geração automática de ID e trim da descrição.
         */
        fun create(
            description: String,
            id: String = UUID.randomUUID().toString(),
            timestamp: Long = System.currentTimeMillis()
        ): SymptomEntry {
            return SymptomEntry(
                id = id,
                description = description.trim(),
                timestamp = timestamp
            )
        }
    }
}

