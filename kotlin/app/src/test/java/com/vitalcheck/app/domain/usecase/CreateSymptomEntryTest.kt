package com.vitalcheck.app.domain.usecase

import com.vitalcheck.app.domain.entity.SymptomEntry
import com.vitalcheck.app.domain.repository.ISymptomRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Testes para o use case CreateSymptomEntry.
 * Verifica orquestração, validação e propagação de erros.
 */
class CreateSymptomEntryTest {

    private val repository = mockk<ISymptomRepository>(relaxed = true)
    private val useCase = CreateSymptomEntry(repository)

    @Test
    fun `deve criar e salvar entrada com descricao valida`() = runTest {
        val entry = useCase("Dor de cabeça")

        assertEquals("Dor de cabeça", entry.description)
        assertTrue(entry.id.isNotBlank())
        coVerify(exactly = 1) { repository.save(any()) }
    }

    @Test
    fun `deve fazer trim na descricao antes de salvar`() = runTest {
        val entry = useCase("  Tontura  ")
        assertEquals("Tontura", entry.description)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar descricao vazia sem chamar repositorio`() = runTest {
        useCase("")
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar descricao apenas com espacos`() = runTest {
        useCase("   ")
    }

    @Test(expected = RuntimeException::class)
    fun `deve propagar erro do repositorio`() = runTest {
        coEvery { repository.save(any()) } throws RuntimeException("DB error")
        useCase("Dor de cabeça")
    }
}

