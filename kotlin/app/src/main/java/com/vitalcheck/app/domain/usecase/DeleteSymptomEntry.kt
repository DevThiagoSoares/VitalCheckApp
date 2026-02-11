package com.vitalcheck.app.domain.usecase

import com.vitalcheck.app.domain.repository.ISymptomRepository

/**
 * Use case: remover um registro de sintoma pelo ID.
 *
 * Valida que o ID não é vazio antes de delegar ao repositório.
 */
class DeleteSymptomEntry(
    private val repository: ISymptomRepository
) {
    suspend operator fun invoke(id: String) {
        require(id.isNotBlank()) { "O ID do sintoma não pode ser vazio." }
        repository.deleteById(id)
    }
}

