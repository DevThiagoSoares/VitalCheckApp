package com.vitalcheck.app.data.datasource

import com.vitalcheck.app.data.local.SymptomDao
import com.vitalcheck.app.data.local.SymptomDbEntity
import com.vitalcheck.app.domain.entity.SymptomEntry

/**
 * Data source local para sintomas — delega operações ao DAO do Room.
 *
 * Responsabilidades:
 * - Conversão entre entidade de domínio e entidade de banco (DTO)
 * - Encapsular operações do DAO
 *
 * O DAO garante thread-safety e atomicidade via suspend functions
 * executadas no dispatcher de IO do Room.
 */
class SymptomLocalDataSource(
    private val dao: SymptomDao
) {
    suspend fun save(entry: SymptomEntry) {
        dao.insert(SymptomDbEntity.fromDomain(entry))
    }

    suspend fun getAll(): List<SymptomEntry> {
        return dao.getAll().map { it.toDomain() }
    }

    suspend fun deleteById(id: String) {
        dao.deleteById(id)
    }
}

