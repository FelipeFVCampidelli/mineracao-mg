import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRegion } from '../data/index.js'
import { useRegionData } from '../hooks/useData.js'
import BackButton from '../components/BackButton.jsx'

const PAGE_SIZE = 60 // municipalities per page

export default function MunicipalitiesPage() {
  const { stateId, regionId } = useParams()
  const region = getRegion(stateId, regionId)
  const { data, loading } = useRegionData(stateId, regionId)
  const [page, setPage] = useState(0)

  const municipalities = data?.municipalities ?? []
  const totalPages = Math.ceil(municipalities.length / PAGE_SIZE)
  const visible = municipalities.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Split into 3 columns
  const perCol = Math.ceil(visible.length / 3)
  const cols = [
    visible.slice(0, perCol),
    visible.slice(perCol, perCol * 2),
    visible.slice(perCol * 2),
  ]

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
        padding: '24px 32px',
        gap: '48px',
        overflow: 'hidden',
      }}>
        {/* Region shape */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', flexShrink: 0 }}>
          <div style={{
            width: '200px', height: '170px',
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

        {/* Municipalities */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '28px 32px',
          flex: 1,
          maxWidth: '720px',
          position: 'relative',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 400,
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            Municípios
          </h2>

          {loading && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
              Carregando…
            </p>
          )}

          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px 16px' }}>
              {cols.map((col, ci) => (
                <div key={ci}>
                  {col.map((name, i) => (
                    <p key={i} style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: 300,
                      color: 'var(--text)',
                      padding: '3px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      letterSpacing: '0.02em',
                    }}>
                      {name}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
            }}>
              {page > 0 && (
                <button
                  onClick={() => setPage(p => p - 1)}
                  style={paginBtnStyle}
                >
                  ← anterior
                </button>
              )}
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
                {page + 1} / {totalPages}
              </span>
              {page < totalPages - 1 && (
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={paginBtnStyle}
                >
                  Ver mais →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const paginBtnStyle = {
  background: 'none',
  border: '1px solid var(--border)',
  borderRadius: '3px',
  color: 'var(--accent)',
  fontFamily: 'var(--font-display)',
  fontSize: '14px',
  padding: '4px 12px',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
}
