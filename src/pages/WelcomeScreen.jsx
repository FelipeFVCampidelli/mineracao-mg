import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '../hooks/useLocale.js'
import LocaleSelector from '../components/LocaleSelector.jsx'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const { t } = useLocale()
  const [step, setStep] = useState(1)

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <LocaleSelector />
      <div style={{
        width: '560px', maxWidth: '90vw',
        background: '#111', border: '1px solid var(--border)',
        borderRadius: '4px', padding: '60px 48px', textAlign: 'center', position: 'relative',
      }}>
        <p style={{ fontFamily: "'Kaisei Decol', serif", fontSize: '32px', fontWeight: 400, color: '#ffffff', lineHeight: 1.4, marginBottom: step === 2 ? '16px' : 0 }}>
          {t('welcome.title')}
        </p>

        {step === 2 && (
          <p style={{ fontFamily: "'Kaisei Decol', serif", fontSize: '16px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em', marginBottom: '32px' }}>
            {t('welcome.subtitle')}
          </p>
        )}

        <div style={{ marginTop: step === 1 ? '40px' : 0 }}>
          <button
            style={btnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            onClick={() => step === 1 ? setStep(2) : navigate('/map')}
          >
            {t('welcome.ok')}
          </button>
        </div>
      </div>
    </div>
  )
}

const btnStyle = {
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: '3px', color: 'var(--text)',
  fontFamily: 'var(--font-body)', fontSize: '13px',
  letterSpacing: '0.1em', padding: '10px 32px',
  cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
}