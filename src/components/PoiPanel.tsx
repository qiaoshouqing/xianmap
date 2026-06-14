import { useState } from 'react'
import { POIS } from '../data/changan'
import type { Poi } from '../data/changan'

interface Props {
  onSelect: (poi: Poi) => void
  selectedId: string | null
}

export default function PoiPanel({ onSelect, selectedId }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <aside className={`poi-panel ${open ? 'open' : 'closed'}`}>
      <button className="poi-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="poi-toggle-text">{open ? '收起' : '古今寻迹'}</span>
        <span className="poi-toggle-arrow">{open ? '›' : '‹'}</span>
      </button>
      <div className="poi-scroll">
        <header className="poi-header">
          <h2>古今寻迹</h2>
          <p>十六处可亲身抵达的长安</p>
        </header>
        <ul className="poi-list">
          {POIS.map(p => (
            <li key={p.id}>
              <button
                className={`poi-card ${selectedId === p.id ? 'selected' : ''}`}
                onClick={() => onSelect(p)}
              >
                <div className="poi-now">
                  <span className="poi-tag poi-tag-now">今</span>
                  <span className="poi-name">{p.name}</span>
                </div>
                <div className="poi-then">
                  <span className="poi-tag poi-tag-tang">唐</span>
                  <span className="poi-tangname">{p.tangName}</span>
                </div>
                <p className="poi-blurb">{p.modern}</p>
              </button>
            </li>
          ))}
        </ul>
        <footer className="poi-footer">
          点击地图任意一处，可知它在唐代的坊名
        </footer>
      </div>
    </aside>
  )
}
