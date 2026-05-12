package com.mineracaomg.ui

import android.graphics.Color as AndroidColor
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.mineracaomg.AppViewModel
import com.mineracaomg.Region
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun MainScreen(vm: AppViewModel = viewModel()) {
    val regionPolygons by vm.regionPolygons.collectAsStateWithLifecycle()
    val maskRings by vm.maskRings.collectAsStateWithLifecycle()
    val mapReady by vm.mapReady.collectAsStateWithLifecycle()
    val selectedRegionId by vm.selectedRegionId.collectAsStateWithLifecycle()
    val regionMinerals by vm.regionMinerals.collectAsStateWithLifecycle()

    val selectedRegion = selectedRegionId?.let { Region.find(it) }

    // Highlight state
    var highlightedRegionId by remember { mutableStateOf<String?>(null) }
    val haptic = LocalHapticFeedback.current

    // Sync highlight with sheet
    LaunchedEffect(selectedRegionId) {
        highlightedRegionId = selectedRegionId
    }

    // Auto-dismiss for long press (only when no sheet open)
    LaunchedEffect(highlightedRegionId, selectedRegionId) {
        if (highlightedRegionId != null && selectedRegionId == null) {
            delay(2000)
            highlightedRegionId = null
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0D0D0D))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(WindowInsets.systemBars.asPaddingValues())
        ) {
            // ── Header (fixed)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .padding(top = 16.dp, bottom = 16.dp)
            ) {
                Text(
                    text = "Mineração em\nMinas Gerais",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Light,
                    color = Color.White,
                    lineHeight = 36.sp,
                )
                Text(
                    text = "${Region.all.size} MESORREGIÕES",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF808080),
                    letterSpacing = 1.5.sp,
                )
            }

            // ── Map card (fixed)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .height(260.dp)
                    .clip(RoundedCornerShape(10.dp))
            ) {
                MineracaoMap(
                    regionPolygons = regionPolygons,
                    maskRings = maskRings,
                    mapReady = mapReady,
                    highlightedRegionId = highlightedRegionId,
                    modifier = Modifier.fillMaxSize(),
                    onRegionClick = { vm.selectRegion(it) },
                )
            }

            // ── Section header (fixed)
            Text(
                text = "Mesorregiões",
                fontSize = 20.sp,
                fontWeight = FontWeight.Normal,
                color = Color.White,
                modifier = Modifier
                    .padding(horizontal = 20.dp)
                    .padding(top = 20.dp, bottom = 8.dp),
            )

            // ── Region list (scrollable)
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
            ) {
                items(Region.all) { region ->
                    val isHighlighted = highlightedRegionId == region.id
                    val bgColor by animateColorAsState(
                        targetValue = if (isHighlighted) region.color.copy(alpha = 0.18f) else Color.Transparent,
                        animationSpec = tween(250),
                        label = "highlight",
                    )

                    RegionRow(
                        region = region,
                        mineralCount = regionMinerals[region.id]?.size ?: 0,
                        backgroundColor = bgColor,
                        onClick = { vm.selectRegion(region.id) },
                        onLongClick = {
                            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                            highlightedRegionId = region.id
                        },
                    )
                    HorizontalDivider(
                        modifier = Modifier.padding(start = 70.dp),
                        color = Color(0xFF1E1E1E),
                    )
                }

                item { Spacer(Modifier.height(40.dp)) }
            }
        }

        // Bottom sheet
        if (selectedRegion != null) {
            RegionSheet(
                region = selectedRegion,
                vm = vm,
                onDismiss = { vm.clearSelection() },
            )
        }
    }
}

// MARK: - RegionRow

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun RegionRow(
    region: Region,
    mineralCount: Int,
    backgroundColor: Color,
    onClick: () -> Unit,
    onLongClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(backgroundColor)
            .combinedClickable(
                onClick = onClick,
                onLongClick = onLongClick,
            )
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        // Color square
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(region.color),
        )

        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
            Text(region.name, fontSize = 16.sp, fontWeight = FontWeight.Normal, color = Color.White)
            Text(
                text = "$mineralCount minério${if (mineralCount == 1) "" else "s"}",
                fontSize = 12.sp,
                color = Color(0xFF737373),
            )
        }

        Text("›", fontSize = 18.sp, color = Color(0xFF4D4D4D))
    }
}
