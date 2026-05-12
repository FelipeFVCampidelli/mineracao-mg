package com.mineracaomg

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.mineracaomg.ui.MainScreen
import com.mineracaomg.ui.theme.MineracaoMGTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MineracaoMGTheme {
                MainScreen()
            }
        }
    }
}
