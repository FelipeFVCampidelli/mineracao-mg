import React from 'react'
import { useParams } from 'react-router-dom'
import { useMineralData } from '../hooks/useData.js'
import { useLocale } from '../hooks/useLocale.js'
import BackButton from '../components/BackButton.jsx'

export default function MineralDetailPage() {
  const { mineralId } = useParams()
  const { data, loading } = useMineralData(mineralId)
  const { locale, t } = useLocale()

  const title = data ? (data[`title_${locale}`] || data.title) : ''
  const description = data ? (data[`description_${locale}`] || data.description) : ''

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
            {data.photo && (
              <div style={{ flexShrink: 0 }}>
                <img
                  src={import.meta.env.BASE_URL + data.photo.replace(/^\//, '')}
                  alt={title}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                {data.source && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginTop: '6px',
                    textAlign: 'center',
                  }}>
                    {t('mineral.source')}: {data.source}
                  </p>
                )}
              </div>
            )}

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
                {title}
              </h1>

              {description
                ? description.split('\n\n').map((para, i) => (
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
                  ))
                : <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
                    {t('mineral.soon')}
                  </p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
