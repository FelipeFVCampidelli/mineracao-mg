import React from 'react'
import { useLocale } from '../hooks/useLocale.js'

const LABELS = { pt: 'PT', en: 'EN', es: 'ES' }

export default function LocaleSelector() {
  const { locale, setLocale, locales } = useLocale()

  return (
    <div style={{
      position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
      display: 'flex', gap: 4,
      background: 'rgba(20,20,20,0.88)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 4, padding: '4px 6px',
      backdropFilter: 'blur(8px)',
    }}>
      {locales.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, alignSelf: 'center' }}>|</span>}
          <button onClick={() => setLocale(l)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 11,
            fontWeight: locale === l ? 500 : 300,
            color: locale === l ? 'var(--text)' : 'var(--text-muted)',
            padding: '2px 4px', letterSpacing: '0.08em',
            transition: 'color 0.2s',
          }}>
            {LABELS[l]}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}