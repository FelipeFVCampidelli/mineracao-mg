package com.mineracaomg.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    background = Color(0xFF0D0D0D),
    surface = Color(0xFF121212),
    surfaceVariant = Color(0xFF1A1A1A),
    surfaceContainerLow = Color(0xFF121212),
    surfaceContainer = Color(0xFF141414),
    surfaceContainerHigh = Color(0xFF1A1A1A),
    surfaceContainerHighest = Color(0xFF1E1E1E),
    primary = Color(0xFFB8860B),
    onPrimary = Color.White,
    onBackground = Color.White,
    onSurface = Color.White,
    onSurfaceVariant = Color(0xFF8C8C8C),
    surfaceTint = Color.Transparent,
)

@Composable
fun MineracaoMGTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content,
    )
}
