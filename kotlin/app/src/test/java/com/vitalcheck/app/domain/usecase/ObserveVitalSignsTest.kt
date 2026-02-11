package com.vitalcheck.app.domain.usecase

import app.cash.turbine.test
import com.vitalcheck.app.domain.entity.VitalSign
import com.vitalcheck.app.domain.repository.IVitalSignProvider
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Testes para o use case ObserveVitalSigns.
 * Verifica delegação do Flow ao provider.
 */
class ObserveVitalSignsTest {

    @Test
    fun `deve emitir leituras do provider`() = runTest {
        val reading = VitalSign(heartRate = 72, steps = 100)
        val provider = mockk<IVitalSignProvider>()
        every { provider.observeVitalSigns() } returns flowOf(reading)

        val useCase = ObserveVitalSigns(provider)

        useCase().test {
            val emitted = awaitItem()
            assertEquals(72, emitted.heartRate)
            assertEquals(100, emitted.steps)
            awaitComplete()
        }
    }

    @Test
    fun `deve emitir multiplas leituras em sequencia`() = runTest {
        val r1 = VitalSign(heartRate = 72, steps = 100)
        val r2 = VitalSign(heartRate = 80, steps = 115)
        val provider = mockk<IVitalSignProvider>()
        every { provider.observeVitalSigns() } returns flowOf(r1, r2)

        val useCase = ObserveVitalSigns(provider)

        useCase().test {
            assertEquals(72, awaitItem().heartRate)
            assertEquals(80, awaitItem().heartRate)
            awaitComplete()
        }
    }
}

