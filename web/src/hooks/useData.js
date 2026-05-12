import { useState, useEffect } from 'react'
import mineralsData from '../data/minerals.json'
import regionsData from '../data/states/mg.json'

export function useRegionData(stateId, regionId) {
  if (stateId === 'mg') {
    return { data: regionsData[regionId] ?? null, loading: false }
  }
  return { data: null, loading: false }
}

export function useMineralData(mineralId) {
  return { data: mineralsData[mineralId] ?? null, loading: false }
}