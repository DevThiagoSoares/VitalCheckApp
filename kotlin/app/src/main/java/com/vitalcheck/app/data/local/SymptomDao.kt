package com.vitalcheck.app.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

/**
 * Data Access Object para operações com a tabela de sintomas.
 *
 * Room gera a implementação automaticamente a partir das anotações.
 * Todas as funções são suspend — integração direta com coroutines.
 *
 * A ordenação DESC por timestamp garante que registros mais recentes
 * venham primeiro, consistente com a versão React Native.
 */
@Dao
interface SymptomDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: SymptomDbEntity)

    @Query("SELECT * FROM symptoms ORDER BY timestamp DESC")
    suspend fun getAll(): List<SymptomDbEntity>

    @Query("DELETE FROM symptoms WHERE id = :id")
    suspend fun deleteById(id: String)
}

