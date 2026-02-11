package com.vitalcheck.app.presentation.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import com.vitalcheck.app.di.ServiceContainer

/**
 * Color scheme Material 3 mapeado para a paleta VitalCheck.
 */
private val LightColorScheme = lightColorScheme(
    primary = VitalColors.Primary,
    onPrimary = VitalColors.Surface,
    secondary = VitalColors.Steps,
    background = VitalColors.Background,
    surface = VitalColors.Surface,
    error = VitalColors.Error,
    onBackground = VitalColors.TextPrimary,
    onSurface = VitalColors.TextPrimary,
    outline = VitalColors.Border
)

/**
 * CompositionLocal para o ServiceContainer.
 *
 * Equivalente ao React Context (ServiceContext.tsx) da versão RN.
 * Permite que qualquer composable na árvore acesse o container
 * de dependências sem prop drilling.
 */
val LocalServiceContainer = staticCompositionLocalOf<ServiceContainer> {
    error(
        "ServiceContainer não fornecido. " +
            "Verifique se VitalCheckTheme está envolvendo a árvore de composables."
    )
}

/**
 * Tema raiz da aplicação.
 *
 * Configura Material 3 + provê o ServiceContainer via CompositionLocal.
 * Todos os componentes filhos acessam o container via:
 *   val container = LocalServiceContainer.current
 */
@Composable
fun VitalCheckTheme(
    serviceContainer: ServiceContainer,
    content: @Composable () -> Unit
) {
    CompositionLocalProvider(
        LocalServiceContainer provides serviceContainer
    ) {
        MaterialTheme(
            colorScheme = LightColorScheme,
            typography = VitalTypography,
            content = content
        )
    }
}

