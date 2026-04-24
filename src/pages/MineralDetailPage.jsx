import React from 'react'
import { useParams } from 'react-router-dom'
import { useMineralData } from '../hooks/useData.js'
import BackButton from '../components/BackButton.jsx'

export default function MineralDetailPage() {
  const { mineralId } = useParams()
  const { data, loading } = useMineralData(mineralId)

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
      }}>
        {loading && (
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Carregando…
          </p>
        )}

        {!loading && data && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '40px',
            maxWidth: '820px',
            width: '100%',
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
          }}>
            {/* Photo */}
            <div style={{ flexShrink: 0 }}>
              <img
                src={data.photo}
                alt={data.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  display: 'block',
                }}
                onError={e => { e.target.style.display = 'none' }}
              />
              {data.photoCredit && (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginTop: '6px',
                  textAlign: 'center',
                }}>
                  Fotógrafo: {data.photoCredit}
                </p>
              )}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 500,
                color: 'var(--text)',
                lineHeight: 1.3,
                marginBottom: '20px',
              }}>
                {data.name}
                {data.subtitle && (
                  <span style={{ fontWeight: 400 }}> ({data.subtitle})</span>
                )}
                {data.symbol && (
                  <span style={{ fontWeight: 400 }}>: ({data.symbol})</span>
                )}
              </h1>

              {data.description.split('\n\n').map((para, i) => (
                <p key={i} style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 300,
                  color: 'var(--text)',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                }}>
                  {para}
                </p>
              ))}

              {data.uses?.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'var(--text)',
                    marginBottom: '8px',
                  }}>
                    Áreas de utilização:
                  </p>
                  {data.uses.map((use, i) => (
                    <p key={i} style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 300,
                      color: 'var(--text)',
                      lineHeight: 1.6,
                      paddingLeft: '8px',
                      borderLeft: '2px solid var(--accent)',
                      marginBottom: '6px',
                    }}>
                      {use}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
