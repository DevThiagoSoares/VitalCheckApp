package com.vitalcheck.app.domain.usecase

import com.vitalcheck.app.domain.entity.VitalSign
import com.vitalcheck.app.domain.repository.IVitalSignProvider
import kotlinx.coroutines.flow.Flow

/**
 * Use case: observar sinais vitais em tempo real.
 *
 * Responsabilidade única: encapsular a subscrição ao stream de dados vitais.
 * Delega a emissão ao provider — o use case apenas expõe o Flow.
 *
 * Em cenários mais complexos, poderia aplicar transformações
 * (debounce, filtro de outliers, agregação) antes de repassar.
 */
class ObserveVitalSigns(
    private val provider: IVitalSignProvider
) {
    operator fun invoke(): Flow<VitalSign> = provider.observeVitalSigns()
}

