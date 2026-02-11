package com.vitalcheck.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.vitalcheck.app.domain.entity.SymptomEntry

/**
 * Entidade Room — representação do sintoma na tabela SQLite.
 *
 * Separada da entidade de domínio (SymptomEntry) para:
 * - Não poluir o domínio com anotações de framework (@Entity, @PrimaryKey)
 * - Permitir evolução independente do schema do banco e do modelo de domínio
 * - Equivalente ao DTO pattern usado na versão React Native
 *
 * Funções de conversão toDomain()/fromDomain() mantêm o mapeamento
 * bidirecional entre as camadas.
 */
@Entity(tableName = "symptoms")
data class SymptomDbEntity(
    @PrimaryKey
    val id: String,
    val description: String,
    val timestamp: Long
) {
    /** Converte entidade de banco para entidade de domínio. */
    fun toDomain(): SymptomEntry = SymptomEntry(
        id = id,
        description = description,
        timestamp = timestamp
    )

    companion object {
        /** Converte entidade de domínio para entidade de banco. */
        fun fromDomain(entry: SymptomEntry): SymptomDbEntity = SymptomDbEntity(
            id = entry.id,
            description = entry.description,
            timestamp = entry.timestamp
        )
    }
}

