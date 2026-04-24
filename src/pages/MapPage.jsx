import React, { useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeoJSON } from '../hooks/useGeoJSON.js'
import { useLocale } from '../hooks/useLocale.js'
import { STATES } from '../data/index.js'
import RegionModal from '../components/RegionModal.jsx'
import LocaleSelector from '../components/LocaleSelector.jsx'

const STATE_ID = 'mg'
const MG = STATES[STATE_ID]

export default function MapPage() {
  const { t } = useLocale()
  const { geoJSON, loading, error } = useGeoJSON(STATE_ID)
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const layersRef = useRef({})

  const highlightRegion = useCallback((activeId) => {
    Object.entries(layersRef.current).forEach(([id, l]) => {
      const r = MG.regions.find(x => x.id === id)
      if (!r) return
      l.setStyle({
        fillColor: activeId === null || id === activeId ? r.color : '#2a2a2a',
        fillOpacity: activeId === null || id === activeId ? 0.65 : 0.9,
        color: id === activeId ? '#ffffff' : 'rgba(255,255,255,0.25)',
        weight: id === activeId ? 2 : 0.8,
      })
    })
  }, [])

  const onEachFeature = useCallback((feature, layer) => {
    const regionId = feature.properties?.regionId
    const region = MG.regions.find(r => r.id === regionId)
    if (!region) return
    layersRef.current[region.id] = layer
    layer.on({
      mouseover: () => { setHoveredId(region.id); highlightRegion(region.id) },
      mouseout:  () => { setHoveredId(null);       highlightRegion(null) },
      click:     () => setSelectedRegion(region.id),
    })
  }, [highlightRegion])

  const styleFeature = useCallback((feature) => {
    const regionId = feature.properties?.regionId
    const region = MG.regions.find(r => r.id === regionId)
    return { fillColor: region?.color ?? '#888', fillOpacity: 0.65, color: 'rgba(255,255,255,0.25)', weight: 0.8 }
  }, [])

  const selectedFeatures = selectedRegion && geoJSON
    ? geoJSON.features.filter(f => f.properties?.regionId === selectedRegion)
    : []

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        bounds={MG.bounds}
        style={{ width: '100%', height: '100%' }}
        zoomControl minZoom={4} maxZoom={18}
        scrollWheelZoom
        maxBounds={[[-35, -75], [6, -28]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Tiles &copy; Esri" maxZoom={18} />
        {geoJSON && <GeoJSON data={geoJSON} style={styleFeature} onEachFeature={onEachFeature} />}
      </MapContainer>

      <LocaleSelector />

      <div style={{
        position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)',
        background: 'rgba(20,20,20,0.88)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '4px', padding: '16px 20px', zIndex: 1000,
        backdropFilter: 'blur(8px)', minWidth: '200px',
      }}>
        {MG.regions.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', cursor: 'pointer', opacity: hoveredId && hoveredId !== r.id ? 0.35 : 1, transition: 'opacity 0.15s' }}
            onMouseEnter={() => { setHoveredId(r.id); highlightRegion(r.id) }}
            onMouseLeave={() => { setHoveredId(null); highlightRegion(null) }}
            onClick={() => setSelectedRegion(r.id)}
          >
            <div style={{ width: 14, height: 14, borderRadius: 2, background: r.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 300, color: 'var(--text)', letterSpacing: '0.02em' }}>{r.name}</span>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,20,20,0.7)', zIndex: 2000, fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: 'var(--text-muted)' }}>
          {t('map.loading')}
        </div>
      )}

      {error && (
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(180,60,60,0.9)', padding: '8px 16px', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: 13, zIndex: 2000 }}>
          {t('map.error')}
        </div>
      )}

      {selectedRegion && (
        <RegionModal stateId={STATE_ID} regionId={selectedRegion} features={selectedFeatures} onClose={() => setSelectedRegion(null)} />
      )}
    </div>
  )
}