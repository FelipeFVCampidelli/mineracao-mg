import { useState, useCallback } from 'react'
import strings from '../data/i18n.json'

const LOCALES = ['pt', 'en', 'es']
const DEFAULT = 'pt'

let _locale = DEFAULT
const _listeners = new Set()

export function useLocale() {
  const [locale, setLocaleState] = useState(_locale)

  const setLocale = useCallback((l) => {
    _locale = l
    _listeners.forEach(fn => fn(l))
  }, [])

  useState(() => {
    _listeners.add(setLocaleState)
    return () => _listeners.delete(setLocaleState)
  })

  const t = useCallback((key) => {
    return strings[locale]?.[key] ?? strings[DEFAULT]?.[key] ?? key
  }, [locale])

  return { locale, setLocale, t, locales: LOCALES }
}