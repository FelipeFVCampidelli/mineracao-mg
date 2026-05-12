import { useState, useEffect } from 'react'
import { STATES } from '../data/index.js'

const cache = {}

// Códigos IBGE de cada mesorregião de MG
const MG_MESO_CODES = {
  'noroeste-de-minas': 3101,
  'norte-de-minas':    3102,
  'jequitinhonha':     3103,
  'vale-do-mucuri':    3104,
  'triangulo-mineiro': 3105,
  'central-mineira':   3106,
  'metropolitana-bh':  3107,
  'vale-do-rio-doce':  3108,
  'oeste-de-minas':    3109,
  'sul-sudoeste':      3110,
  'campo-das-vertentes': 3111,
  'zona-da-mata':      3112,
}

const MESO_CODES_BY_STATE = {
  mg: MG_MESO_CODES,
}

export function useGeoJSON(stateId) {
  const [geoJSON, setGeoJSON] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!stateId) return
    if (cache[stateId]) {
      setGeoJSON(cache[stateId])
      setLoading(false)
      return
    }

    const mesoCodes = MESO_CODES_BY_STATE[stateId]
    if (!mesoCodes) return

    const entries = Object.entries(mesoCodes)

    Promise.all(
      entries.map(([regionId, code]) =>
        fetch(`https://servicodados.ibge.gov.br/api/v3/malhas/mesorregioes/${code}?formato=application/vnd.geo%2Bjson`)
          .then(r => r.json())
          .then(data => {
            const features = (data.features ?? []).map(f => ({
              ...f,
              properties: { ...f.properties, regionId },
            }))
            return features
          })
          .catch(err => {
            console.error(`[IBGE] erro na região ${regionId}:`, err)
            return []
          })
      )
    ).then(allFeatures => {
      const combined = {
        type: 'FeatureCollection',
        features: allFeatures.flat(),
      }
      console.log('[IBGE] total features carregados:', combined.features.length)
      cache[stateId] = combined
      setGeoJSON(combined)
      setLoading(false)
    })
  }, [stateId])

  return { geoJSON, loading, error }
}