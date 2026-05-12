package com.mineracaomg.ui

import android.graphics.Color as AndroidColor
import android.view.MotionEvent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.mineracaomg.Region
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.OnlineTileSourceBase
import org.osmdroid.util.GeoPoint
import org.osmdroid.util.MapTileIndex
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Polygon

// Dark tile source (CartoDB Dark Matter) — minimal labels, dark background
private val darkTileSource = object : OnlineTileSourceBase(
    "CartoDB_DarkMatter",
    0, 19, 256, ".png",
    arrayOf(
        "https://a.basemaps.cartocdn.com/dark_all/",
        "https://b.basemaps.cartocdn.com/dark_all/",
        "https://c.basemaps.cartocdn.com/dark_all/",
    )
) {
    override fun getTileURLString(pMapTileIndex: Long): String {
        val z = MapTileIndex.getZoom(pMapTileIndex)
        val x = MapTileIndex.getX(pMapTileIndex)
        val y = MapTileIndex.getY(pMapTileIndex)
        return "$baseUrl$z/$x/$y$mImageFilenameEnding"
    }
}

// World rectangle used for the inverse mask (dark overlay outside MG)
private val worldBoundary = listOf(
    GeoPoint(-85.0, -180.0),
    GeoPoint(-85.0, 180.0),
    GeoPoint(85.0, 180.0),
    GeoPoint(85.0, -180.0),
    GeoPoint(-85.0, -180.0),
)

// Bounding box for Minas Gerais (south, west, north, east)
private val mgBoundingBox = org.osmdroid.util.BoundingBox(-14.2, -39.8, -22.9, -51.1)

@Composable
fun MineracaoMap(
    regionPolygons: Map<String, List<List<GeoPoint>>>,
    maskRings: List<List<GeoPoint>>,
    mapReady: Boolean,
    highlightedRegionId: String? = null,
    modifier: Modifier = Modifier,
    onRegionClick: (String) -> Unit,
) {
    val context = LocalContext.current

    // Configure osmdroid once
    LaunchedEffect(Unit) {
        Configuration.getInstance().apply {
            userAgentValue = context.packageName
        }
    }

    Box(modifier = modifier) {
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { ctx ->
                MapView(ctx).apply {
                    setTileSource(darkTileSource)

                    // Disable all interactions
                    setMultiTouchControls(false)
                    isFlingEnabled = false
                    setBuiltInZoomControls(false)
                    isHorizontalMapRepetitionEnabled = false
                    isVerticalMapRepetitionEnabled = false

                    // Block all touch events on the map
                    setOnTouchListener { _, _ -> true }

                    // Fit MG bounds after layout
                    post {
                        zoomToBoundingBox(mgBoundingBox, false, 30)
                        // Lock zoom after fitting
                        minZoomLevel = zoomLevelDouble
                        maxZoomLevel = zoomLevelDouble
                    }
                }
            },
            update = { mapView ->
                mapView.overlays.clear()

                val hasHighlight = highlightedRegionId != null

                // Inverse mask: darkens everything outside MG
                if (maskRings.isNotEmpty()) {
                    val mask = Polygon(mapView).apply {
                        points = worldBoundary
                        holes = maskRings
                        fillPaint.color = AndroidColor.argb(232, 13, 13, 13)
                        outlinePaint.color = AndroidColor.TRANSPARENT
                        outlinePaint.strokeWidth = 0f
                    }
                    mapView.overlays.add(mask)
                }

                // Region polygons
                regionPolygons.forEach { (regionId, rings) ->
                    val region = Region.find(regionId)
                    val baseColor = region?.colorArgb ?: AndroidColor.GRAY
                    val isTarget = regionId == highlightedRegionId

                    val alpha = when {
                        !hasHighlight -> 165   // ~0.65
                        isTarget -> 230        // ~0.9
                        else -> 51             // ~0.2
                    }
                    val strokeAlpha = when {
                        !hasHighlight -> 64
                        isTarget -> 230
                        else -> 20
                    }
                    val strokeWidth = if (isTarget) 4f else 2f

                    rings.forEach { ring ->
                        val poly = Polygon(mapView).apply {
                            points = ring
                            fillPaint.color = AndroidColor.argb(
                                alpha,
                                AndroidColor.red(baseColor),
                                AndroidColor.green(baseColor),
                                AndroidColor.blue(baseColor),
                            )
                            outlinePaint.color = AndroidColor.argb(strokeAlpha, 255, 255, 255)
                            outlinePaint.strokeWidth = strokeWidth
                            setOnClickListener { _, _, _ ->
                                onRegionClick(regionId)
                                true
                            }
                        }
                        mapView.overlays.add(poly)
                    }
                }

                mapView.invalidate()
            }
        )

        // Loading overlay while GeoJSON is fetching
        if (!mapReady) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center,
            ) {
                CircularProgressIndicator(color = Color(0xFF666666))
            }
        }
    }
}
