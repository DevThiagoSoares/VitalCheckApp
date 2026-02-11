package com.vitalcheck.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.vitalcheck.app.presentation.navigation.AppNavigation
import com.vitalcheck.app.presentation.theme.VitalCheckTheme

/**
 * Activity principal — ponto de entrada da UI.
 *
 * Responsabilidades mínimas:
 * 1. Habilitar edge-to-edge rendering
 * 2. Configurar o tema com ServiceContainer
 * 3. Delegar toda a UI ao AppNavigation
 *
 * Equivalente ao App.tsx da versão React Native.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val app = application as VitalCheckApplication

        setContent {
            VitalCheckTheme(serviceContainer = app.serviceContainer) {
                AppNavigation()
            }
        }
    }
}

