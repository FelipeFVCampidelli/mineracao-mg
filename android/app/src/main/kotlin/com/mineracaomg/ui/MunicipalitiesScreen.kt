package com.mineracaomg.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mineracaomg.Region

@Composable
fun MunicipalitiesScreen(
    region: Region,
    municipalities: List<String>,
    onBack: () -> Unit,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        SheetHeader(
            title = "Municípios",
            region = region,
            onBack = onBack,
        )

        if (municipalities.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                contentAlignment = Alignment.Center,
            ) {
                CircularProgressIndicator(color = Color(0xFF666666))
            }
        } else {
            Column(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(0.dp),
            ) {
                Text(
                    text = "${municipalities.size} municípios",
                    fontSize = 11.sp,
                    color = Color(0xFF666666),
                    fontWeight = FontWeight.Medium,
                    letterSpacing = 0.5.sp,
                    modifier = Modifier.padding(bottom = 12.dp, start = 4.dp),
                )

                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 480.dp),
                    verticalArrangement = Arrangement.spacedBy(2.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    items(municipalities) { name ->
                        Text(
                            text = name,
                            fontSize = 13.sp,
                            color = Color(0xFFCCCCCC),
                            fontWeight = FontWeight.Light,
                            modifier = Modifier.padding(vertical = 6.dp),
                            maxLines = 1,
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(40.dp))
    }
}
