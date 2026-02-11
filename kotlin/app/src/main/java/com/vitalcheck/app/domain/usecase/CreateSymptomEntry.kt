package com.vitalcheck.app.domain.usecase

import com.vitalcheck.app.domain.entity.SymptomEntry
import com.vitalcheck.app.domain.repository.ISymptomRepository

/**
 * Use case: criar um novo registro de sintoma.
 *
 * Responsabilidades:
 * 1. Criar a entidade com validação (via SymptomEntry.create)
 * 2. Persistir via repositório
 * 3. Retornar a entidade criada para atualização otimista da UI
 *
 * A validação ocorre na criação da entidade (fail-fast).
 * Se a descrição for inválida, uma IllegalArgumentException é lançada
 * antes de qualquer IO.
 */
class CreateSymptomEntry(
    private val repository: ISymptomRepository
) {
    suspend operator fun invoke(description: String): SymptomEntry {
        val entry = SymptomEntry.create(description = description)
        repository.save(entry)
        return entry
    }
}

