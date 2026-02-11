package com.vitalcheck.app.presentation.viewmodel

import app.cash.turbine.test
import com.vitalcheck.app.domain.entity.VitalSign
import com.vitalcheck.app.domain.usecase.ObserveVitalSigns
import com.vitalcheck.app.domain.repository.IVitalSignProvider
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

/**
 * Testes do VitalSignsViewModel.
 * Verifica transições de estado e tratamento de erros.
 */
@OptIn(ExperimentalCoroutinesApi::class)
class VitalSignsViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `estado inicial deve ser loading`() = runTest {
        val provider = mockk<IVitalSignProvider>()
        every { provider.observeVitalSigns() } returns flow { /* never emits */ }
        val viewModel = VitalSignsViewModel(ObserveVitalSigns(provider))

        assertTrue(viewModel.uiState.value.isLoading)
        assertNull(viewModel.uiState.value.currentReading)
        assertNull(viewModel.uiState.value.error)
    }

    @Test
    fun `deve atualizar estado quando receber leitura`() = runTest {
        val reading = VitalSign(heartRate = 72, steps = 100)
        val provider = mockk<IVitalSignProvider>()
        every { provider.observeVitalSigns() } returns flowOf(reading)

        val viewModel = VitalSignsViewModel(ObserveVitalSigns(provider))
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertNotNull(state.currentReading)
        assertEquals(72, state.currentReading!!.heartRate)
        assertNull(state.error)
    }

    @Test
    fun `deve definir erro quando flow falhar`() = runTest {
        val provider = mockk<IVitalSignProvider>()
        every { provider.observeVitalSigns() } returns flow {
            throw RuntimeException("Sensor error")
        }

        val viewModel = VitalSignsViewModel(ObserveVitalSigns(provider))
        advanceUntilIdle()

        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertEquals("Sensor error", state.error)
    }
}

