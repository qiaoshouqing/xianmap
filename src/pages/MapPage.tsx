import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import MapView from '../components/MapView'
import ControlDock from '../components/ControlDock'
import PoiPanel from '../components/PoiPanel'
import type { Poi } from '../data/changan'

export default function MapPage() {
  const [t, setT] = useState(0.55)
  const [poi, setPoi] = useState<Poi | null>(null)
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

      {/* 题签 */}
      <header className="title-card">
        <div className="title-seal">長安<br />輿圖</div>
        <div className="title-text">
          <h1>長安 · 西安</h1>
          <p>一千三百年，两座城，叠于一图</p>
        </div>
        <Link to="/kao" className="title-link">舆图考</Link>
      </header>

      <PoiPanel onSelect={p => setPoi({ ...p })} selectedId={poi?.id ?? null} />
      <ControlDock t={t} onChange={setT} />

      {/* 首访引导 */}
      {!introDismissed && (
        <div className="intro-veil" onClick={dismissIntro}>
          <div className="intro-card" onClick={e => e.stopPropagation()}>
            <div className="intro-seal">遊</div>
            <h2>欢迎来到长安</h2>
            <p>
              这张图把<strong>唐代长安城</strong>按真实坐标叠在<strong>今日西安</strong>的街道上——
              一百一十坊、东西两市、三大内，皆考之于《长安志》《唐六典》。
            </p>
            <ul>
              <li><b>拖动下方铜钱滑杆</b>，在今与唐之间穿越</li>
              <li><b>点击地图任意处</b>，看你脚下是唐代哪一坊</li>
              <li><b>右侧「古今寻迹」</b>，是十六处今天仍能抵达的长安</li>
            </ul>
            <button className="intro-btn" onClick={dismissIntro}>入 城</button>
          </div>
        </div>
      )}
    </div>
  )
}
