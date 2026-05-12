// Central registry — add new states here to expand the platform

export const STATES = {
  mg: {
    id: 'mg',
    name: 'Minas Gerais',
    // Bounds for Leaflet fitBounds: [[south, west], [north, east]]
    bounds: [[-22.9, -51.1], [-14.2, -39.8]],
    // IBGE code for fetching GeoJSON
    ibgeCode: 31,
    regions: [
      { id: 'jequitinhonha',       name: 'Jequitinhonha',          color: '#FF00FF', ibgeName: 'Jequitinhonha' },
      { id: 'norte-de-minas',      name: 'Norte',                   color: '#7B4F2E', ibgeName: 'Norte de Minas' },
      { id: 'noroeste-de-minas',   name: 'Noroeste',                color: '#A8B8C8', ibgeName: 'Noroeste de Minas' },
      { id: 'triangulo-mineiro',   name: 'Triângulo Mineiro',       color: '#7ECECA', ibgeName: 'Triângulo Mineiro/Alto Paranaíba' },
      { id: 'sul-sudoeste',        name: 'Sul e Sudoeste',         color: '#6B2D8B', ibgeName: 'Sul/Sudoeste de Minas' },
      { id: 'central-mineira',     name: 'Central',                 color: '#00BCD4', ibgeName: 'Central Mineira' },
      { id: 'oeste-de-minas',      name: 'Oeste',                   color: '#C8B400', ibgeName: 'Oeste de Minas' },
      { id: 'campo-das-vertentes', name: 'Campo das Vertentes',     color: '#2C2C2C', ibgeName: 'Campo das Vertentes' },
      { id: 'metropolitana-bh',    name: 'Metropolitana de BH',     color: '#D2691E', ibgeName: 'Metropolitana de Belo Horizonte' },
      { id: 'zona-da-mata',        name: 'Zona da Mata',            color: '#1A3EBF', ibgeName: 'Zona da Mata' },
      { id: 'vale-do-rio-doce',    name: 'Vale do Rio Doce',        color: '#2E8B57', ibgeName: 'Vale do Rio Doce' },
      { id: 'vale-do-mucuri',      name: 'Vale do Mucuri',          color: '#A52A2A', ibgeName: 'Vale do Mucuri' },
    ]
  }
  // sp: { ... } — future state
}

export function getState(stateId) {
  return STATES[stateId] ?? null
}

export function getRegion(stateId, regionId) {
  return STATES[stateId]?.regions.find(r => r.id === regionId) ?? null
}