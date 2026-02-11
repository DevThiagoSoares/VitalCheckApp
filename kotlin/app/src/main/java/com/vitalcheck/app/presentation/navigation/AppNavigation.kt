package com.vitalcheck.app.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.vitalcheck.app.presentation.screen.DashboardScreen
import com.vitalcheck.app.presentation.screen.SymptomLogScreen
import com.vitalcheck.app.presentation.theme.VitalColors

/**
 * Definição das rotas de navegação.
 *
 * Sealed class para tipagem exaustiva — o compilador garante
 * que todas as rotas são tratadas nos when blocks.
 */
sealed class Screen(
    val route: String,
    val label: String,
    val icon: ImageVector
) {
    data object Dashboard : Screen(
        route = "dashboard",
        label = "Dashboard",
        icon = Icons.Filled.Favorite
    )
    data object SymptomLog : Screen(
        route = "symptom_log",
        label = "Sintomas",
        icon = Icons.Outlined.Description
    )
}

private val screens = listOf(Screen.Dashboard, Screen.SymptomLog)

/**
 * Navegação principal com Bottom Navigation Bar.
 *
 * Equivalente ao AppNavigator.tsx da versão React Native.
 * Usa Navigation Compose com Scaffold para layout da bottom bar.
 *
 * Material 3 NavigationBar lida automaticamente com:
 * - Safe area insets (home indicator iOS-style, gesture bar Android)
 * - Animações de transição entre itens
 * - Elevação e sombra
 */
@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = VitalColors.Surface,
                tonalElevation = 0.dp
            ) {
                screens.forEach { screen ->
                    val selected = currentDestination?.hierarchy?.any {
                        it.route == screen.route
                    } == true

                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = screen.icon,
                                contentDescription = screen.label
                            )
                        },
                        label = {
                            Text(
                                text = screen.label,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = VitalColors.Primary,
                            selectedTextColor = VitalColors.Primary,
                            unselectedIconColor = VitalColors.TextTertiary,
                            unselectedTextColor = VitalColors.TextTertiary,
                            indicatorColor = VitalColors.Primary.copy(alpha = 0.1f)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Dashboard.route) {
                DashboardScreen()
            }
            composable(Screen.SymptomLog.route) {
                SymptomLogScreen()
            }
        }
    }
}

