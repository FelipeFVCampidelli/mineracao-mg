import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRegion } from '../data/index.js'
import { useRegionData } from '../hooks/useData.js'
import BackButton from '../components/BackButton.jsx'

const MINERAL_NAMES = {
  'ferro':        'Ferro',
  'ouro':         'Ouro',
  'diamante':     'Diamante',
  'calcario':     'Calcário',
  'litio':        'Lítio',
  'granito':      'Granito',
  'bauxita':      'Bauxita',
  'quartzo':      'Quartzo',
  'silica':       'Sílica',
  'fosfato':      'Fosfato',
  'agua-mineral': 'Água Mineral',
  'terra-rara':   'Terra Rara',
}

export default function MineralsPage() {
  const { stateId, regionId } = useParams()
  const navigate = useNavigate()
  const region = getRegion(stateId, regionId)
  const { data, loading } = useRegionData(stateId, regionId)

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <BackButton />
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        gap: '80px',
      }}>
        {/* Region shape */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '240px', height: '200px',
            background: region?.color ?? '#555',
            borderRadius: '6px', opacity: 0.85,
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '18px', height: '18px', background: region?.color ?? '#555', borderRadius: '3px' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text)' }}>
              {region?.name}
            </span>
          </div>
        </div>

        {/* Mineral list */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '32px 48px',
          minWidth: '240px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 400,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            Minérios
          </h2>

          {loading && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
              Carregando…
            </p>
          )}

          {!loading && data?.minerals?.map(mineralId => (
            <button
              key={mineralId}
              onClick={() => navigate(`/${stateId}/${regionId}/minerios/${mineralId}`)}
              style={{
                display: 'block',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 400,
                color: 'var(--accent)',
                padding: '6px 0',
                textAlign: 'center',
                transition: 'color 0.2s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
            >
              {MINERAL_NAMES[mineralId] ?? mineralId}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
