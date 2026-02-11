package com.vitalcheck.app.domain.usecase

import com.vitalcheck.app.domain.entity.SymptomEntry
import com.vitalcheck.app.domain.repository.ISymptomRepository

/**
 * Use case: obter histórico de sintomas.
 *
 * Retorna a lista completa ordenada do mais recente ao mais antigo.
 * A ordenação é garantida pelo repositório (ORDER BY timestamp DESC).
 */
class GetSymptomHistory(
    private val repository: ISymptomRepository
) {
    suspend operator fun invoke(): List<SymptomEntry> = repository.getAll()
}

