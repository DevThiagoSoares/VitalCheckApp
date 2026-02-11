package com.vitalcheck.app.di

import android.content.Context
import com.vitalcheck.app.data.datasource.MockVitalSignProvider
import com.vitalcheck.app.data.datasource.SymptomLocalDataSource
import com.vitalcheck.app.data.local.SymptomDatabase
import com.vitalcheck.app.data.repository.SymptomRepositoryImpl
import com.vitalcheck.app.data.repository.VitalSignRepositoryImpl
import com.vitalcheck.app.domain.repository.ISymptomRepository
import com.vitalcheck.app.domain.repository.IVitalSignProvider
import com.vitalcheck.app.domain.usecase.CreateSymptomEntry
import com.vitalcheck.app.domain.usecase.DeleteSymptomEntry
import com.vitalcheck.app.domain.usecase.GetSymptomHistory
import com.vitalcheck.app.domain.usecase.ObserveVitalSigns

/**
 * Composition Root — ponto único de criação e wiring de dependências.
 *
 * Equivalente ao ServiceContainer.ts da versão React Native.
 * Instancia todas as camadas respeitando o grafo de dependências
 * da Clean Architecture (domínio não depende de data/apresentação).
 *
 * Decisão: DI manual ao invés de Hilt/Dagger/Koin porque:
 * - 2 telas não justificam a complexidade de um framework DI
 * - Mais explícito e fácil de rastrear dependências
 * - Consistente com a abordagem da versão React Native
 * - Facilmente substituível por Hilt se o projeto crescer
 *
 * O container é instanciado uma vez no Application e exposto
 * via CompositionLocal para toda a árvore Compose.
 */
class ServiceContainer(context: Context) {

    // --- Data Sources ---
    private val database = SymptomDatabase.getInstance(context)
    private val symptomDao = database.symptomDao()
    private val vitalSignDataSource = MockVitalSignProvider(intervalMs = 3000L)
    private val symptomLocalDataSource = SymptomLocalDataSource(symptomDao)

    // --- Repositories ---
    private val vitalSignProvider: IVitalSignProvider =
        VitalSignRepositoryImpl(vitalSignDataSource)
    private val symptomRepository: ISymptomRepository =
        SymptomRepositoryImpl(symptomLocalDataSource)

    // --- Use Cases (expostos para ViewModels) ---
    val observeVitalSigns = ObserveVitalSigns(vitalSignProvider)
    val createSymptomEntry = CreateSymptomEntry(symptomRepository)
    val getSymptomHistory = GetSymptomHistory(symptomRepository)
    val deleteSymptomEntry = DeleteSymptomEntry(symptomRepository)
}

