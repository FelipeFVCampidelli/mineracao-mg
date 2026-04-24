import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function BackButton({ to }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        letterSpacing: '0.05em',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
    >
      ← voltar
    </button>
  )
}