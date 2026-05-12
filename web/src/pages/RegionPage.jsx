import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRegion } from '../data/index.js'
import BackButton from '../components/BackButton.jsx'

export default function RegionPage() {
  const { stateId, regionId } = useParams()
  const navigate = useNavigate()
  const region = getRegion(stateId, regionId)

  if (!region) {
    return (
      <div style={{ padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
        Região não encontrada.
      </div>
    )
  }

  const btnStyle = {
    display: 'block',
    width: '100%',
    padding: '20px 32px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 400,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
    letterSpacing: '0.02em',
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <BackButton to="/map" />
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
        {/* Region shape placeholder */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
        }}>
          <div style={{
            width: '240px',
            height: '200px',
            background: region.color,
            borderRadius: '6px',
            opacity: 0.85,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* The actual shape will come from GeoJSON — placeholder for now */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '18px', height: '18px',
              background: region.color,
              borderRadius: '3px',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              color: 'var(--text)',
            }}>
              {region.name}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '220px' }}>
          <button
            style={btnStyle}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-card-hover)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-card)'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => navigate(`/${stateId}/${regionId}/minerios`)}
          >
            Minérios
          </button>

          <button
            style={btnStyle}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-card-hover)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-card)'
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onClick={() => navigate(`/${stateId}/${regionId}/municipios`)}
          >
            Municípios
          </button>
        </div>
      </div>
    </div>
  )
}
