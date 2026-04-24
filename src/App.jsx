import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WelcomeScreen from './pages/WelcomeScreen.jsx'
import MapPage from './pages/MapPage.jsx'
import RegionPage from './pages/RegionPage.jsx'
import MineralsPage from './pages/MineralsPage.jsx'
import MunicipalitiesPage from './pages/MunicipalitiesPage.jsx'
import MineralDetailPage from './pages/MineralDetailPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/:stateId/:regionId" element={<RegionPage />} />
      <Route path="/:stateId/:regionId/minerios" element={<MineralsPage />} />
      <Route path="/:stateId/:regionId/municipios" element={<MunicipalitiesPage />} />
      <Route path="/:stateId/:regionId/minerios/:mineralId" element={<MineralDetailPage />} />
    </Routes>
  )
}
