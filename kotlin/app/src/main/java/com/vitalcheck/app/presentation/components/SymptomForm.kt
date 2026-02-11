package com.vitalcheck.app.presentation.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vitalcheck.app.presentation.theme.VitalColors

/**
 * Formulário para registro de novos sintomas.
 *
 * Gerencia apenas estado local do input (texto digitado).
 * A lógica de persistência é delegada ao callback onSubmit.
 *
 * Inclui:
 * - Contador de caracteres (max 500)
 * - Feedback háptico ao submeter
 * - Estado de loading durante salvamento
 * - Botão desabilitado quando input vazio
 *
 * @param onSubmit Callback chamado com a descrição trimmed. O ViewModel
 *                 é responsável por lançar a coroutine de salvamento.
 */
@Composable
fun SymptomForm(
    onSubmit: (String) -> Unit,
    isSaving: Boolean,
    modifier: Modifier = Modifier
) {
    var text by remember { mutableStateOf("") }
    val focusManager = LocalFocusManager.current
    val view = LocalView.current
    val isDisabled = text.isBlank() || isSaving

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = VitalColors.Surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            TextField(
                value = text,
                onValueChange = { if (it.length <= 500) text = it },
                placeholder = {
                    Text(
                        "Descreva seu sintoma...",
                        color = VitalColors.TextTertiary
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 80.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    cursorColor = VitalColors.Primary
                ),
                textStyle = TextStyle(
                    fontSize = 15.sp,
                    color = VitalColors.TextPrimary
                ),
                enabled = !isSaving
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${text.length}/500",
                    color = VitalColors.TextTertiary,
                    fontSize = 12.sp
                )

                Button(
                    onClick = {
                        val trimmed = text.trim()
                        if (trimmed.isNotBlank()) {
                            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
                            onSubmit(trimmed)
                            text = ""
                            focusManager.clearFocus()
                        }
                    },
                    enabled = !isDisabled,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = VitalColors.Primary,
                        disabledContainerColor = VitalColors.Border
                    )
                ) {
                    if (isSaving) {
                        CircularProgressIndicator(
                            color = VitalColors.Surface,
                            strokeWidth = 2.dp,
                            modifier = Modifier.padding(horizontal = 8.dp)
                        )
                    } else {
                        Text(
                            "Registrar",
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }
}
