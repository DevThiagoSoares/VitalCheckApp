package com.vitalcheck.app.domain.entity

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test

/**
 * Testes unitários para a entidade VitalSign.
 * Validação de invariantes, limites e imutabilidade.
 */
class VitalSignTest {

    @Test
    fun `deve criar VitalSign com valores validos`() {
        val vs = VitalSign(heartRate = 72, steps = 1000)
        assertEquals(72, vs.heartRate)
        assertEquals(1000, vs.steps)
    }

    @Test
    fun `deve aceitar frequencia cardiaca no limite inferior`() {
        val vs = VitalSign(heartRate = 0, steps = 0)
        assertEquals(0, vs.heartRate)
    }

    @Test
    fun `deve aceitar frequencia cardiaca no limite superior`() {
        val vs = VitalSign(heartRate = 300, steps = 0)
        assertEquals(300, vs.heartRate)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar frequencia cardiaca negativa`() {
        VitalSign(heartRate = -1, steps = 0)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar frequencia cardiaca acima de 300`() {
        VitalSign(heartRate = 301, steps = 0)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar passos negativos`() {
        VitalSign(heartRate = 72, steps = -1)
    }

    @Test
    fun `deve aceitar zero passos`() {
        val vs = VitalSign(heartRate = 72, steps = 0)
        assertEquals(0, vs.steps)
    }

    @Test
    fun `data class deve implementar equals corretamente`() {
        val timestamp = System.currentTimeMillis()
        val vs1 = VitalSign(72, 100, timestamp)
        val vs2 = VitalSign(72, 100, timestamp)
        assertEquals(vs1, vs2)
    }

    @Test
    fun `data class deve diferenciar valores diferentes`() {
        val timestamp = System.currentTimeMillis()
        val vs1 = VitalSign(72, 100, timestamp)
        val vs2 = VitalSign(80, 100, timestamp)
        assertNotEquals(vs1, vs2)
    }

    @Test
    fun `copy deve criar nova instancia com valores alterados`() {
        val original = VitalSign(72, 100)
        val copy = original.copy(heartRate = 80)
        assertEquals(80, copy.heartRate)
        assertEquals(100, copy.steps)
    }
}

