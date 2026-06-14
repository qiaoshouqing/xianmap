import { useState } from 'react'
import { POIS } from '../data/changan'
import type { Poi } from '../data/changan'
import { useLocale, tr } from '../i18n'

interface Props {
  onSelect: (poi: Poi) => void
  selectedId: string | null
}

export default function PoiPanel({ onSelect, selectedId }: Props) {
  // 桌面默认展开（侧栏），移动端默认收起（仅留把手，地图留白）
  const [open, setOpen] = useState(() => window.innerWidth > 900)
  const { locale, t } = useLocale()

  return (
    <aside className={`poi-panel ${open ? 'open' : 'closed'}`}>
      {/* 列表（桌面在上方滚动区；移动端从把手上方展开） */}
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

      {/* 把手 / 标题栏 */}
      <button className="poi-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="poi-toggle-text">{t.panelTitle}</span>
        <span className="poi-toggle-arrow" aria-hidden>{open ? '›' : '‹'}</span>
      </button>
    </aside>
  )
}
