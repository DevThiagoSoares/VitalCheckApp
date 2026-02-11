package com.vitalcheck.app.data.datasource

import app.cash.turbine.test
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Testes para o MockVitalSignProvider.
 * Verifica valores realistas e comportamento do Flow.
 */
class MockVitalSignProviderTest {

    @Test
    fun `deve emitir primeira leitura imediatamente`() = runTest {
        val provider = MockVitalSignProvider(intervalMs = 10_000L)

        provider.observeVitalSigns().test {
            val first = awaitItem()
            assertTrue(first.heartRate in 60..100)
            assertTrue(first.steps >= 0)
            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `deve gerar frequencia cardiaca dentro de faixa realista`() = runTest {
        val provider = MockVitalSignProvider(intervalMs = 1L)
        val readings = mutableListOf<Int>()

        provider.observeVitalSigns().test {
            repeat(20) {
                readings.add(awaitItem().heartRate)
            }
            cancelAndIgnoreRemainingEvents()
        }

        readings.forEach { hr ->
            assertTrue("HR $hr fora da faixa 60-100", hr in 60..100)
        }
    }

    @Test
    fun `deve incrementar passos monotonicamente`() = runTest {
        val provider = MockVitalSignProvider(intervalMs = 1L)
        var previousSteps = -1

        provider.observeVitalSigns().test {
            repeat(10) {
                val steps = awaitItem().steps
                assertTrue(
                    "Passos devem ser >= anterior ($previousSteps), mas foi $steps",
                    steps >= previousSteps
                )
                previousSteps = steps
            }
            cancelAndIgnoreRemainingEvents()
        }
    }
}

