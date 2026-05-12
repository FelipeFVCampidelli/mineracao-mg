package com.mineracaomg

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.osmdroid.util.GeoPoint

class AppViewModel(application: Application) : AndroidViewModel(application) {

    private val dataService = DataService(application)
    private val geoService = GeoJSONService()
    private val municipalitiesService = MunicipalitiesService()

    // MARK: - State

    private val _minerals = MutableStateFlow<Map<String, Mineral>>(emptyMap())
    val minerals: StateFlow<Map<String, Mineral>> = _minerals.asStateFlow()

    private val _regionMinerals = MutableStateFlow<Map<String, List<String>>>(emptyMap())
    val regionMinerals: StateFlow<Map<String, List<String>>> = _regionMinerals.asStateFlow()

    // regionId → list of polygon rings
    private val _regionPolygons = MutableStateFlow<Map<String, List<List<GeoPoint>>>>(emptyMap())
    val regionPolygons: StateFlow<Map<String, List<List<GeoPoint>>>> = _regionPolygons.asStateFlow()

    // State boundary rings used as holes for the inverse mask
    private val _maskRings = MutableStateFlow<List<List<GeoPoint>>>(emptyList())
    val maskRings: StateFlow<List<List<GeoPoint>>> = _maskRings.asStateFlow()

    private val _mapReady = MutableStateFlow(false)
    val mapReady: StateFlow<Boolean> = _mapReady.asStateFlow()

    private val _selectedRegionId = MutableStateFlow<String?>(null)
    val selectedRegionId: StateFlow<String?> = _selectedRegionId.asStateFlow()

    private val _municipalities = MutableStateFlow<List<String>>(emptyList())
    val municipalities: StateFlow<List<String>> = _municipalities.asStateFlow()

    private val _locale = MutableStateFlow(AppLocale.PT)
    val locale: StateFlow<AppLocale> = _locale.asStateFlow()

    // MARK: - Init

    init {
        loadLocalData()
        loadGeoData()
    }

    // MARK: - Helpers

    fun mineralsForRegion(regionId: String): List<Mineral> {
        val ids = _regionMinerals.value[regionId] ?: return emptyList()
        val allMinerals = _minerals.value
        return ids.mapNotNull { allMinerals[it] }
    }

    fun selectRegion(id: String) {
        _selectedRegionId.value = id
        _municipalities.value = emptyList()
        loadMunicipalities(id)
    }

    fun clearSelection() {
        _selectedRegionId.value = null
    }

    fun setLocale(locale: AppLocale) {
        _locale.value = locale
    }

    // MARK: - Private

    private fun loadLocalData() {
        _minerals.value = dataService.loadMinerals()
        _regionMinerals.value = dataService.loadRegionMinerals()
    }

    private fun loadGeoData() {
        viewModelScope.launch {
            try {
                coroutineScope {
                    val polygonsDeferred = async { geoService.fetchAllRegions() }
                    val boundaryDeferred = async { geoService.fetchStateBoundary() }
                    _regionPolygons.value = polygonsDeferred.await()
                    _maskRings.value = boundaryDeferred.await()
                }
            } catch (e: Exception) {
                android.util.Log.e("AppViewModel", "GeoJSON load error", e)
            } finally {
                _mapReady.value = true
            }
        }
    }

    private fun loadMunicipalities(regionId: String) {
        viewModelScope.launch {
            _municipalities.value = municipalitiesService.fetch(regionId)
        }
    }
}
