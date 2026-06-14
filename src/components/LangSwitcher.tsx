import { useState, useRef, useEffect } from 'react'
import { useLocale, LOCALES, LOCALE_NAMES } from '../i18n'

export default function LangSwitcher() {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="lang" ref={ref}>
      <button
        className="lang-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.langLabel}
        title={t.langLabel}
      >
        <span className="lang-globe" aria-hidden>✦</span>
        <span className="lang-current">{LOCALE_NAMES[locale]}</span>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox">
          {LOCALES.map(l => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === locale}
                className={`lang-item ${l === locale ? 'active' : ''}`}
                onClick={() => {
                  setLocale(l)
                  setOpen(false)
                }}
              >
                {LOCALE_NAMES[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
