import { useState } from 'react'
import { POIS } from '../data/changan'
import type { Poi } from '../data/changan'
import { useLocale, tr } from '../i18n'

interface Props {
  onSelect: (poi: Poi) => void
  selectedId: string | null
}

export default function PoiPanel({ onSelect, selectedId }: Props) {
  const [open, setOpen] = useState(true)
  const { locale, t } = useLocale()

  return (
    <aside className={`poi-panel ${open ? 'open' : 'closed'}`}>
      <button className="poi-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="poi-toggle-text">{open ? t.panelCollapse : t.panelTitle}</span>
        <span className="poi-toggle-arrow">{open ? '›' : '‹'}</span>
      </button>
      <div className="poi-scroll">
        <header className="poi-header">
          <h2>{t.panelTitle}</h2>
          <p>{t.panelSubtitle}</p>
        </header>
        <ul className="poi-list">
          {POIS.map(p => (
            <li key={p.id}>
              <button
                className={`poi-card ${selectedId === p.id ? 'selected' : ''}`}
                onClick={() => onSelect(p)}
              >
                <div className="poi-now">
                  <span className="poi-tag poi-tag-now">{t.tagNow}</span>
                  <span className="poi-name">{tr(p.name, locale)}</span>
                </div>
                <div className="poi-then">
                  <span className="poi-tag poi-tag-tang">{t.tagTang}</span>
                  <span className="poi-tangname">{tr(p.tangName, locale)}</span>
                </div>
                <p className="poi-blurb">{tr(p.modern, locale)}</p>
              </button>
            </li>
          ))}
        </ul>
        <footer className="poi-footer">{t.panelFooter}</footer>
      </div>
    </aside>
  )
}
