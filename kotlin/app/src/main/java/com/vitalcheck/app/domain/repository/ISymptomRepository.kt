package com.vitalcheck.app.domain.repository

import com.vitalcheck.app.domain.entity.SymptomEntry

/**
 * Interface (porta) para persistência de sintomas.
 *
 * Funções suspending — integração natural com coroutines.
 * Cada operação é atômica e thread-safe quando implementada com Room.
 *
 * A abstração permite trocar Room por DataStore, Realm, ou API remota
 * sem modificar o domínio.
 */
interface ISymptomRepository {

    /** Persiste um novo registro de sintoma. */
    suspend fun save(entry: SymptomEntry)

    /** Retorna todos os registros ordenados do mais recente ao mais antigo. */
    suspend fun getAll(): List<SymptomEntry>

    /** Remove um registro pelo ID. */
    suspend fun deleteById(id: String)
}

