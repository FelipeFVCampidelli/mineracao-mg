package com.mineracaomg

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.net.URL

class MunicipalitiesService {

    private val json = Json { ignoreUnknownKeys = true }
    private val cache = mutableMapOf<String, List<String>>()

    suspend fun fetch(regionId: String): List<String> {
        cache[regionId]?.let { return it }
        val region = Region.find(regionId) ?: return emptyList()

        return withContext(Dispatchers.IO) {
            try {
                val url = "https://servicodados.ibge.gov.br/api/v1/localidades" +
                        "/mesorregioes/${region.ibgeCode}/municipios"
                val text = URL(url).openStream().bufferedReader().readText()
                val items = json.decodeFromString<List<MunicipioJson>>(text)
                val names = items.map { it.nome }.sortedWith(compareBy(String.CASE_INSENSITIVE_ORDER) { it })
                cache[regionId] = names
                names
            } catch (e: Exception) {
                android.util.Log.e("MunicipalitiesService", "Fetch error", e)
                emptyList()
            }
        }
    }

    @Serializable
    private data class MunicipioJson(val nome: String)
}
