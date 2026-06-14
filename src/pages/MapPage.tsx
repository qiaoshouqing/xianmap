import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import MapView from '../components/MapView'
import ControlDock from '../components/ControlDock'
import PoiPanel from '../components/PoiPanel'
import LangSwitcher from '../components/LangSwitcher'
import type { Poi } from '../data/changan'
import { useLocale } from '../i18n'

export default function MapPage() {
  const [t, setT] = useState(0.55)
  const [poi, setPoi] = useState<Poi | null>(null)
  const { t: s } = useLocale()
  const [introDismissed, setIntroDismissed] = useState(
    () => localStorage.getItem('changan-intro') === '1',
  )

  const dismissIntro = () => {
    localStorage.setItem('changan-intro', '1')
    setIntroDismissed(true)
  }

  return (
    <div className="map-page">
      <MapView t={t} flyToPoi={poi} />

      {/* 题签（汉字题签为标志，保留） */}
      <header className="title-card">
        <div className="title-seal">長安<br />輿圖</div>
        <div className="title-text">
          <h1>長安 · 西安</h1>
          <p>{s.subtitle}</p>
        </div>
        <Link to="/kao" className="title-link">{s.sourcesLink}</Link>
      </header>

      <LangSwitcher />

      <PoiPanel onSelect={p => setPoi({ ...p })} selectedId={poi?.id ?? null} />
      <ControlDock t={t} onChange={setT} />

      {/* 首访引导 */}
      {!introDismissed && (
        <div className="intro-veil" onClick={dismissIntro}>
          <div className="intro-card" onClick={e => e.stopPropagation()}>
            <div className="intro-seal">遊</div>
            <h2>{s.introTitle}</h2>
            <p>{s.introBody}</p>
            <ul>
              {s.introList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <button className="intro-btn" onClick={dismissIntro}>{s.introBtn}</button>
          </div>
        </div>
      )}
    </div>
  )
}
