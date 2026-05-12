package com.mineracaomg

import android.content.Context
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

class DataService(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true }

    // MARK: - Minerals

    fun loadMinerals(): Map<String, Mineral> {
        return try {
            val text = context.assets.open("minerals.json").bufferedReader().readText()
            json.decodeFromString<Map<String, Mineral>>(text)
        } catch (e: Exception) {
            android.util.Log.e("DataService", "Failed to load minerals.json", e)
            emptyMap()
        }
    }

    // MARK: - Region minerals (mg.json)

    fun loadRegionMinerals(): Map<String, List<String>> {
        return try {
            val text = context.assets.open("mg.json").bufferedReader().readText()
            val raw = json.decodeFromString<Map<String, RegionData>>(text)
            raw.mapValues { it.value.minerals }
        } catch (e: Exception) {
            android.util.Log.e("DataService", "Failed to load mg.json", e)
            emptyMap()
        }
    }

    @Serializable
    private data class RegionData(val minerals: List<String>)
}
