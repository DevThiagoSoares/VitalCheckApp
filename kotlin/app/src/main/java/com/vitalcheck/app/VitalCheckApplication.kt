package com.vitalcheck.app

import android.app.Application
import com.vitalcheck.app.di.ServiceContainer

/**
 * Application class — ponto de entrada do ciclo de vida da aplicação.
 *
 * Responsabilidades:
 * 1. Inicializar o ServiceContainer (Composition Root)
 * 2. Expor o container como singleton para toda a aplicação
 *
 * O container é criado uma vez e compartilhado via CompositionLocal
 * (Theme.kt) — equivalente ao ServiceProvider do React Native.
 */
class VitalCheckApplication : Application() {

    lateinit var serviceContainer: ServiceContainer
        private set

    override fun onCreate() {
        super.onCreate()
        serviceContainer = ServiceContainer(this)
    }
}

