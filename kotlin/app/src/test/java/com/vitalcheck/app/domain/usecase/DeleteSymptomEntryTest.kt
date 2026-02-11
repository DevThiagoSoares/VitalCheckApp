package com.vitalcheck.app.domain.usecase

import com.vitalcheck.app.domain.repository.ISymptomRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Test

/**
 * Testes para o use case DeleteSymptomEntry.
 * Verifica validação de ID e delegação ao repositório.
 */
class DeleteSymptomEntryTest {

    private val repository = mockk<ISymptomRepository>(relaxed = true)
    private val useCase = DeleteSymptomEntry(repository)

    @Test
    fun `deve deletar entrada pelo ID`() = runTest {
        useCase("abc-123")
        coVerify(exactly = 1) { repository.deleteById("abc-123") }
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar ID vazio`() = runTest {
        useCase("")
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar ID apenas com espacos`() = runTest {
        useCase("   ")
    }

    @Test(expected = RuntimeException::class)
    fun `deve propagar erro do repositorio`() = runTest {
        coEvery { repository.deleteById(any()) } throws RuntimeException("DB error")
        useCase("abc-123")
    }
}

