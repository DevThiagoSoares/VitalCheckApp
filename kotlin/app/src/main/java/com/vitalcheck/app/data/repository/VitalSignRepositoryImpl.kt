package com.vitalcheck.app.data.repository

import com.vitalcheck.app.data.datasource.MockVitalSignProvider
import com.vitalcheck.app.domain.entity.VitalSign
import com.vitalcheck.app.domain.repository.IVitalSignProvider
import kotlinx.coroutines.flow.Flow

/**
 * Implementação do provider de sinais vitais.
 *
 * Delega ao MockVitalSignProvider. Em produção, seria substituída
 * por uma implementação que integra com Google Fit ou sensores BLE.
 *
 * A troca de implementação requer apenas alterar a injeção no
 * ServiceContainer — nenhuma mudança no domínio ou apresentação.
 */
class VitalSignRepositoryImpl(
    private val dataSource: MockVitalSignProvider
) : IVitalSignProvider {

    override fun observeVitalSigns(): Flow<VitalSign> =
        dataSource.observeVitalSigns()
}

