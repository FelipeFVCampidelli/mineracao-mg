package com.mineracaomg

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import org.osmdroid.util.GeoPoint
import java.net.URL

class GeoJSONService {

    // Fetches polygon rings for all 12 mesorregiões in parallel.
    // Returns: regionId → list of rings (each ring is a list of GeoPoint).
    suspend fun fetchAllRegions(): Map<String, List<List<GeoPoint>>> = coroutineScope {
        val deferreds = Region.all.map { region ->
            async { region.id to fetchRegion(region.ibgeCode) }
        }
        deferreds.associate { it.await() }
    }

    // Fetches all rings of the MG state boundary (used for the inverse mask).
    suspend fun fetchStateBoundary(): List<List<GeoPoint>> = withContext(Dispatchers.IO) {
        val url = "https://servicodados.ibge.gov.br/api/v3/malhas/estados/31" +
                "?formato=application%2Fvnd.geo%2Bjson"
        val json = URL(url).openStream().bufferedReader().readText()
        parseAllRings(json)
    }

    private suspend fun fetchRegion(ibgeCode: Int): List<List<GeoPoint>> = withContext(Dispatchers.IO) {
        val url = "https://servicodados.ibge.gov.br/api/v3/malhas/mesorregioes/$ibgeCode" +
                "?formato=application%2Fvnd.geo%2Bjson"
        val json = URL(url).openStream().bufferedReader().readText()
        parseAllRings(json)
    }

    // Parses all outer rings from a GeoJSON FeatureCollection (Polygon or MultiPolygon).
    private fun parseAllRings(geojson: String): List<List<GeoPoint>> {
        val rings = mutableListOf<List<GeoPoint>>()
        try {
            val root = JSONObject(geojson)
            val features = root.getJSONArray("features")
            for (i in 0 until features.length()) {
                val geometry = features.getJSONObject(i).getJSONObject("geometry")
                val type = geometry.getString("type")
                val coords = geometry.getJSONArray("coordinates")
                when (type) {
                    "Polygon" -> {
                        rings.add(parseRing(coords.getJSONArray(0)))
                    }
                    "MultiPolygon" -> {
                        for (pi in 0 until coords.length()) {
                            rings.add(parseRing(coords.getJSONArray(pi).getJSONArray(0)))
                        }
                    }
                }
            }
        } catch (e: Exception) {
            android.util.Log.e("GeoJSONService", "Parse error", e)
        }
        return rings
    }

    private fun parseRing(coordArray: JSONArray): List<GeoPoint> {
        val points = mutableListOf<GeoPoint>()
        for (i in 0 until coordArray.length()) {
            val pt = coordArray.getJSONArray(i)
            val lon = pt.getDouble(0)
            val lat = pt.getDouble(1)
            points.add(GeoPoint(lat, lon))
        }
        return points
    }
}
