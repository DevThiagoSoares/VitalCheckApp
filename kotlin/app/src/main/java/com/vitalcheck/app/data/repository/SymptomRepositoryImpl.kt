package com.vitalcheck.app.data.repository

import com.vitalcheck.app.data.datasource.SymptomLocalDataSource
import com.vitalcheck.app.domain.entity.SymptomEntry
import com.vitalcheck.app.domain.repository.ISymptomRepository

/**
 * Implementação do repositório de sintomas.
 *
 * Delega ao SymptomLocalDataSource (Room).
 * Abstração permite futura adição de cache em memória
 * ou sincronização com servidor remoto.
 */
class SymptomRepositoryImpl(
    private val localDataSource: SymptomLocalDataSource
) : ISymptomRepository {

    override suspend fun save(entry: SymptomEntry) =
        localDataSource.save(entry)

    override suspend fun getAll(): List<SymptomEntry> =
        localDataSource.getAll()

    override suspend fun deleteById(id: String) =
        localDataSource.deleteById(id)
}

