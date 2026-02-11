package com.vitalcheck.app.domain.entity

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Testes unitários para a entidade SymptomEntry.
 * Validação de invariantes, factory e limites.
 */
class SymptomEntryTest {

    @Test
    fun `deve criar SymptomEntry com valores validos`() {
        val entry = SymptomEntry(id = "abc", description = "Dor de cabeça")
        assertEquals("abc", entry.id)
        assertEquals("Dor de cabeça", entry.description)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar descricao vazia`() {
        SymptomEntry(id = "abc", description = "")
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar descricao apenas com espacos`() {
        SymptomEntry(id = "abc", description = "   ")
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar descricao com mais de 500 caracteres`() {
        val longDescription = "a".repeat(501)
        SymptomEntry(id = "abc", description = longDescription)
    }

    @Test
    fun `deve aceitar descricao com exatamente 500 caracteres`() {
        val description = "a".repeat(500)
        val entry = SymptomEntry(id = "abc", description = description)
        assertEquals(500, entry.description.length)
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar ID vazio`() {
        SymptomEntry(id = "", description = "Dor de cabeça")
    }

    @Test(expected = IllegalArgumentException::class)
    fun `deve rejeitar ID apenas com espacos`() {
        SymptomEntry(id = "   ", description = "Dor de cabeça")
    }

    @Test
    fun `factory create deve fazer trim na descricao`() {
        val entry = SymptomEntry.create(description = "  Dor de cabeça  ")
        assertEquals("Dor de cabeça", entry.description)
    }

    @Test
    fun `factory create deve gerar ID automaticamente`() {
        val entry = SymptomEntry.create(description = "Tontura")
        assertTrue(entry.id.isNotBlank())
    }

    @Test
    fun `factory create deve gerar IDs unicos`() {
        val entry1 = SymptomEntry.create(description = "Tontura")
        val entry2 = SymptomEntry.create(description = "Febre")
        assertTrue(entry1.id != entry2.id)
    }

    @Test
    fun `factory create deve gerar timestamp automaticamente`() {
        val before = System.currentTimeMillis()
        val entry = SymptomEntry.create(description = "Dor")
        val after = System.currentTimeMillis()
        assertTrue(entry.timestamp in before..after)
    }
}

