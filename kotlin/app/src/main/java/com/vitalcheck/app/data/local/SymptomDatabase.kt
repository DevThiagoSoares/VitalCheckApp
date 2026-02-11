package com.vitalcheck.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

/**
 * Banco de dados Room para persistência local de sintomas.
 *
 * Padrão Singleton thread-safe via synchronized + volatile.
 * Room é escolhido sobre DataStore porque:
 * - Suporte a queries SQL complexas (futuras buscas/filtros)
 * - Migrações de schema versionadas
 * - Integração nativa com Coroutines e Flow
 *
 * Na versão React Native usamos AsyncStorage (key-value simples).
 * Room é a evolução natural para Android — oferece tipagem forte
 * e validação de queries em tempo de compilação via KSP.
 */
@Database(
    entities = [SymptomDbEntity::class],
    version = 1,
    exportSchema = false
)
abstract class SymptomDatabase : RoomDatabase() {

    abstract fun symptomDao(): SymptomDao

    companion object {
        @Volatile
        private var INSTANCE: SymptomDatabase? = null

        fun getInstance(context: Context): SymptomDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    SymptomDatabase::class.java,
                    "vitalcheck_symptoms.db"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { INSTANCE = it }
            }
        }
    }
}

