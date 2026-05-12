package com.mineracaomg.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.mineracaomg.AppLocale
import com.mineracaomg.Mineral
import androidx.compose.material3.Text
import androidx.compose.foundation.clickable

@Composable
fun MineralDetailScreen(
    mineral: Mineral,
    locale: AppLocale,
    onBack: () -> Unit,
) {
    val title = mineral.localizedTitle(locale)
    val description = mineral.localizedDescription(locale)
    val tagline = mineral.localizedTagline(locale)

    // Build asset URI from photo path: "/images/minerals/ferro.png" → "file:///android_asset/images/minerals/ferro.png"
    val assetUri = mineral.photo?.let { "file:///android_asset$it" }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState())
            .background(Color(0xFF121212))
    ) {
        // Back button
        Row(
            modifier = Modifier
                .clickable(onClick = onBack)
                .padding(horizontal = 20.dp, vertical = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Text("←", fontSize = 14.sp, color = Color(0xFF8C8C8C), modifier = Modifier.alignByBaseline())
            Text("Voltar", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF8C8C8C), modifier = Modifier.alignByBaseline())
        }

        // Photo
        if (assetUri != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp)
                    .background(Color(0xFF1E1E1E)),
            ) {
                AsyncImage(
                    model = ImageRequest.Builder(LocalContext.current)
                        .data(assetUri)
                        .crossfade(true)
                        .build(),
                    contentDescription = title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize(),
                )
            }

            // Photo credit
            val source = mineral.source
            if (!source.isNullOrBlank() && !source.startsWith("<")) {
                Text(
                    text = "Fonte: $source",
                    fontSize = 11.sp,
                    color = Color(0xFF595959),
                    modifier = Modifier
                        .padding(horizontal = 20.dp)
                        .padding(top = 8.dp),
                )
            }
        }

        // Title + tagline
        Column(
            modifier = Modifier
                .padding(horizontal = 20.dp)
                .padding(top = 24.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Text(
                text = title,
                fontSize = 28.sp,
                fontWeight = FontWeight.Light,
                color = Color.White,
                lineHeight = 34.sp,
            )
            if (tagline.isNotBlank()) {
                Text(
                    text = tagline,
                    fontSize = 13.sp,
                    color = Color(0xFF737373),
                )
            }
        }

        // Description paragraphs
        if (description.isNotBlank()) {
            Column(
                modifier = Modifier
                    .padding(horizontal = 20.dp)
                    .padding(top = 20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                description.split("\n\n").forEach { paragraph ->
                    if (paragraph.isNotBlank()) {
                        Text(
                            text = paragraph.trim(),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Light,
                            color = Color(0xFFD9D9D9),
                            lineHeight = 22.sp,
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(48.dp))
    }
}
