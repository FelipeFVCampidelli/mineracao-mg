package com.mineracaomg.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.mineracaomg.AppLocale
import com.mineracaomg.AppViewModel
import com.mineracaomg.Mineral
import com.mineracaomg.Region
import com.mineracaomg.SheetScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegionSheet(
    region: Region,
    vm: AppViewModel,
    onDismiss: () -> Unit,
) {
    val locale by vm.locale.collectAsStateWithLifecycle()
    val minerals = remember(region.id) { vm.mineralsForRegion(region.id) }
    val municipalities by vm.municipalities.collectAsStateWithLifecycle()

    // In-sheet navigation stack
    var screenStack by remember { mutableStateOf(listOf<SheetScreen>(SheetScreen.Home)) }
    val currentScreen = screenStack.last()

    fun push(screen: SheetScreen) { screenStack = screenStack + screen }
    fun pop() {
        if (screenStack.size > 1) screenStack = screenStack.dropLast(1)
        else onDismiss()
    }

    // Handle system back
    BackHandler { pop() }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
        dragHandle = { BottomSheetDefaults.DragHandle() },
        containerColor = Color(0xFF121212),
        tonalElevation = 0.dp,
        contentColor = Color.White,
        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
    ) {
        when (val screen = currentScreen) {
            is SheetScreen.Home -> {
                HomeScreen(
                    region = region,
                    minerals = minerals,
                    locale = locale,
                    onBack = onDismiss,
                    onMineralClick = { push(SheetScreen.MineralDetail(it.id)) },
                    onMunicipalitiesClick = { push(SheetScreen.Municipalities) },
                )
            }
            is SheetScreen.MineralDetail -> {
                val mineral = vm.minerals.collectAsStateWithLifecycle().value[screen.mineralId]
                if (mineral != null) {
                    MineralDetailScreen(
                        mineral = mineral,
                        locale = locale,
                        onBack = { pop() },
                    )
                }
            }
            is SheetScreen.Municipalities -> {
                MunicipalitiesScreen(
                    region = region,
                    municipalities = municipalities,
                    onBack = { pop() },
                )
            }
        }
    }
}

// MARK: - HomeScreen (minerals list)

@Composable
private fun HomeScreen(
    region: Region,
    minerals: List<Mineral>,
    locale: AppLocale,
    onBack: () -> Unit,
    onMineralClick: (Mineral) -> Unit,
    onMunicipalitiesClick: () -> Unit,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        SheetHeader(
            title = "Minérios",
            region = region,
            onBack = onBack,
        )

        LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(bottom = 40.dp),
        ) {
            if (minerals.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier.fillMaxWidth().padding(top = 40.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text("Sem dados disponíveis.", fontSize = 14.sp, color = Color(0xFF666666))
                    }
                }
            } else {
                items(minerals) { mineral ->
                    MineralRow(mineral = mineral, locale = locale, onClick = { onMineralClick(mineral) })
                    HorizontalDivider(modifier = Modifier.padding(start = 70.dp), color = Color(0xFF1E1E1E))
                }
            }

            item {
                MunicipalitiesButton(
                    modifier = Modifier
                        .padding(horizontal = 12.dp)
                        .padding(top = 24.dp),
                    onClick = onMunicipalitiesClick,
                )
            }
        }
    }
}

// MARK: - SheetHeader

@Composable
fun SheetHeader(
    title: String,
    region: Region,
    onBack: () -> Unit,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // Back button
        Row(
            modifier = Modifier
                .clickable(onClick = onBack)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Text("←", fontSize = 14.sp, color = Color(0xFF8C8C8C), modifier = Modifier.alignByBaseline())
            Text("Voltar", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Color(0xFF8C8C8C), modifier = Modifier.alignByBaseline())
        }

        // Title row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = title,
                fontSize = 26.sp,
                fontWeight = FontWeight.Light,
                color = Color.White,
                modifier = Modifier.weight(1f),
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(5.dp),
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(region.color),
                )
                Text(region.name, fontSize = 12.sp, color = Color(0xFF808080))
            }
        }

        HorizontalDivider(color = Color(0xFF1E1E1E))
    }
}

// MARK: - MineralRow

@Composable
fun MineralRow(
    mineral: Mineral,
    locale: AppLocale,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        // Symbol badge
        SymbolBadge(symbol = mineral.symbol ?: "?", color = mineral.badgeColor)

        Text(
            text = mineral.localizedTitle(locale),
            fontSize = 15.sp,
            fontWeight = FontWeight.Normal,
            color = Color.White,
            maxLines = 1,
            modifier = Modifier.weight(1f),
        )

        Text("›", fontSize = 18.sp, color = Color(0xFF4D4D4D))
    }
}

// MARK: - SymbolBadge

@Composable
fun SymbolBadge(symbol: String, color: Color) {
    Box(
        modifier = Modifier
            .size(36.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(color.copy(alpha = 0.7f)),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = symbol,
            fontSize = if (symbol.length > 2) 9.sp else 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color.White,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
        )
    }
}

// MARK: - MunicipalitiesButton

@Composable
private fun MunicipalitiesButton(modifier: Modifier = Modifier, onClick: () -> Unit) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(Color(0xFF141414))
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFF1E1E1E)),
            contentAlignment = Alignment.Center,
        ) {
            Text("🏛", fontSize = 16.sp)
        }

        Text(
            text = "Ver Municípios",
            fontSize = 15.sp,
            color = Color(0xFFCCCCCC),
            modifier = Modifier.weight(1f),
        )

        Text("›", fontSize = 18.sp, color = Color(0xFF4D4D4D))
    }
}
