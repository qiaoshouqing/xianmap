import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  CENTER, locateInTang, tangLabels, silkGeo, wardsGeo, palacesGeo,
  marketsGeo, marketStreetsGeo, waterGeo, gardensGeo, wallsGeo, gatesGeo,
  sitesGeo, canalsGeo, mingWallGeo, POIS, TANG_SITES,
} from '../data/changan'
import type { Poi } from '../data/changan'
import { useLocale, tr, type Locale } from '../i18n'
import type { UIStrings } from '../i18n/ui'

interface Props {
  t: number // 0 = 今, 1 = 唐
  flyToPoi: Poi | null
  onMapReady?: (map: maplibregl.Map) => void
}

/** 各图层在 t=1 时的最大不透明度 */
const MAX_OPACITY: Record<string, number> = {
  'tang-silk': 0.94,
  'tang-garden': 0.55,
  'tang-ward-fill': 0.5,
  'tang-ward-line': 0.85,
  'tang-palace-fill': 0.55,
  'tang-palace-line': 0.95,
  'tang-market-fill': 0.6,
  'tang-market-line': 0.9,
  'tang-market-streets': 0.7,
  'tang-water': 0.78,
  'tang-canals': 0.7,
  'tang-walls': 0.95,
  'tang-walls-glow': 0.25,
  'tang-gates': 0.95,
  'tang-sites': 0.95,
  'ming-wall': 0.8, // 唐图越浓，越需要"今"的参照
}

const esc = (str: string) =>
  str.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

function poiPopupHtml(p: Poi, locale: Locale, s: UIStrings): string {
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">迹</span>
        <div>
          <div class="tang-popup-eyebrow">${esc(s.popNowPrefix + tr(p.name, locale))}</div>
          <div class="tang-popup-title">${esc(s.popTangPrefix + tr(p.tangName, locale))}</div>
        </div>
      </div>
      <p class="tang-popup-text">${esc(tr(p.tang, locale))}</p>
    </div>`
}

// TangLocation.zone → UI.zoneTag 键
const ZONE_KEY: Record<string, string> = {
  ward: 'ward', palace: 'palace', market: 'market', water: 'water',
  garden: 'garden', street: 'street', imperial: 'city', outside: 'outskirts',
}

function popupHtml(lngLat: maplibregl.LngLat, locale: Locale, s: UIStrings): string {
  const loc = locateInTang(lngLat.lng, lngLat.lat, locale)
  const tag = s.zoneTag[ZONE_KEY[loc.zone]] ?? ''
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">${esc(tag)}</span>
        <div>
          <div class="tang-popup-eyebrow">${esc(s.popLocatedEyebrow)}</div>
          <div class="tang-popup-title">${esc(loc.title)}</div>
        </div>
      </div>
      ${loc.detail ? `<p class="tang-popup-text">${esc(loc.detail)}</p>` : ''}
      ${loc.story ? `<p class="tang-popup-text"><span class="tang-popup-dian">${esc(s.popLore)}</span>${esc(loc.story)}</p>` : ''}
    </div>`
}

function sitePopupHtml(name: string, locale: Locale, s: UIStrings): string {
  const site = TANG_SITES.find(x => x.name === name)
  const title = site ? tr(site.title, locale) : name
  const note = site ? tr(site.note, locale) : ''
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">迹</span>
        <div>
          <div class="tang-popup-eyebrow">${esc(s.popSiteEyebrow)}</div>
          <div class="tang-popup-title">${esc(title)}</div>
        </div>
      </div>
      <p class="tang-popup-text">${esc(note)}</p>
    </div>`
}

export default function MapView({ t, flyToPoi, onMapReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const labelRootRef = useRef<HTMLDivElement | null>(null)
  const tRef = useRef(t)
  const { locale, t: s } = useLocale()
  // 事件回调在地图初始化时一次性注册，用 ref 读取最新语言
  const localeRef = useRef(locale)
  const sRef = useRef(s)
  useEffect(() => {
    localeRef.current = locale
    sRef.current = s
  }, [locale, s])

  // 初始化
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      center: CENTER,
      zoom: 12.1,
      minZoom: 9.5,
      maxZoom: 17.5,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          carto: {
            type: 'raster',
            tiles: [
              // Voyager：道路分色、街名地名齐全，仍足够柔和可叠绢层
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors © CARTO',
          },
        },
        layers: [{ id: 'base', type: 'raster', source: 'carto' }],
      },
    })
    mapRef.current = map
    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__changanMap = map
      map.on('load', () => console.log('[changan] map load fired'))
      map.on('error', e => console.error('[changan] map error', e.error?.message))
    }

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    })
    map.addControl(geolocate, 'bottom-right')

    map.on('load', () => {
      // ── 数据源 ──
      map.addSource('silk', { type: 'geojson', data: silkGeo })
      map.addSource('wards', { type: 'geojson', data: wardsGeo })
      map.addSource('palaces', { type: 'geojson', data: palacesGeo })
      map.addSource('markets', { type: 'geojson', data: marketsGeo })
      map.addSource('market-streets', { type: 'geojson', data: marketStreetsGeo })
      map.addSource('water', { type: 'geojson', data: waterGeo })
      map.addSource('gardens', { type: 'geojson', data: gardensGeo })
      map.addSource('walls', { type: 'geojson', data: wallsGeo })
      map.addSource('gates', { type: 'geojson', data: gatesGeo })
      map.addSource('sites', { type: 'geojson', data: sitesGeo })
      map.addSource('canals', { type: 'geojson', data: canalsGeo })
      map.addSource('ming-wall', { type: 'geojson', data: mingWallGeo })

      // ── 绢底 ──
      map.addLayer({ id: 'tang-silk', type: 'fill', source: 'silk', paint: { 'fill-color': '#f1e6cb' } })
      // ── 芙蓉园 ──
      map.addLayer({ id: 'tang-garden', type: 'fill', source: 'gardens', paint: { 'fill-color': '#a8b389' } })
      // ── 坊 ──
      map.addLayer({
        id: 'tang-ward-fill', type: 'fill', source: 'wards',
        paint: {
          'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#e8cfa0', '#ead9b4'],
        },
      })
      map.addLayer({
        id: 'tang-ward-line', type: 'line', source: 'wards',
        paint: { 'line-color': '#a8542f', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.5, 14, 1.6] },
      })
      // ── 宫城 / 皇城 / 大明宫 / 兴庆宫 ──
      map.addLayer({
        id: 'tang-palace-fill', type: 'fill', source: 'palaces',
        paint: { 'fill-color': ['match', ['get', 'kind'], 'imperial', '#ddba88', '#d99a72'] },
      })
      map.addLayer({
        id: 'tang-palace-line', type: 'line', source: 'palaces',
        paint: { 'line-color': '#8e3420', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.2, 14, 3] },
      })
      // ── 两市 ──
      map.addLayer({ id: 'tang-market-fill', type: 'fill', source: 'markets', paint: { 'fill-color': '#d8b36a' } })
      map.addLayer({
        id: 'tang-market-line', type: 'line', source: 'markets',
        paint: { 'line-color': '#8e5a20', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 14, 2.4] },
      })
      map.addLayer({
        id: 'tang-market-streets', type: 'line', source: 'market-streets',
        minzoom: 12.5,
        paint: { 'line-color': '#8e5a20', 'line-width': 1, 'line-dasharray': [2, 1.5] },
      })
      // ── 水 ──
      map.addLayer({
        id: 'tang-water', type: 'fill', source: 'water',
        paint: { 'fill-color': '#7da6a0', 'fill-outline-color': '#4f7d77' },
      })
      // ── 渠水 ──
      map.addLayer({
        id: 'tang-canals', type: 'line', source: 'canals',
        paint: {
          'line-color': '#5f8d86',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 14.5, 2.6],
        },
        layout: { 'line-cap': 'round', 'line-join': 'round' },
      })
      // ── 城垣 ──
      map.addLayer({
        id: 'tang-walls-glow', type: 'line', source: 'walls',
        paint: { 'line-color': '#8e3420', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 6, 14, 14], 'line-blur': 6 },
      })
      map.addLayer({
        id: 'tang-walls', type: 'line', source: 'walls',
        paint: { 'line-color': '#7c2d1c', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 2, 14, 4.5] },
      })
      // ── 城门 ──
      map.addLayer({
        id: 'tang-gates', type: 'circle', source: 'gates',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 3, 14, 5.5],
          'circle-color': '#f1e6cb',
          'circle-stroke-color': '#7c2d1c',
          'circle-stroke-width': 2,
        },
      })
      // ── 唐迹点位（泥金菱点） ──
      map.addLayer({
        id: 'tang-sites', type: 'circle', source: 'sites',
        minzoom: 11.8,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 3, 15, 5],
          'circle-color': '#b58a3a',
          'circle-stroke-color': '#fdf8ea',
          'circle-stroke-width': 1.5,
        },
      })
      // ── 明城墙（今）对照虚线 ──
      map.addLayer({
        id: 'ming-wall', type: 'line', source: 'ming-wall',
        paint: {
          'line-color': '#46606e',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.6, 14, 3],
          'line-dasharray': [3, 2],
        },
      })

      // ── HTML 标注层（竖排坊名等） ──
      const root = document.createElement('div')
      root.className = 'tang-label-root'
      labelRootRef.current = root
      for (const l of tangLabels) {
        // MapLibre 会给 Marker 根元素写入内联 opacity，
        // 因此外层仅作容器，样式与透明度都放在内层元素上
        const wrap = document.createElement('div')
        const el = document.createElement('div')
        el.className = `tang-label tang-label-${l.kind}`
        el.dataset.minzoom = String(l.minZoom)
        if (l.kind === 'ward' || l.kind === 'street' || l.kind === 'poem') {
          el.classList.add('tang-label-vertical')
        }
        if (l.hasStory) el.classList.add('tang-label-has-story')
        el.textContent = l.text
        wrap.appendChild(el)
        const anchor = l.kind === 'site' ? 'top' : 'center'
        new maplibregl.Marker({ element: wrap, anchor }).setLngLat([l.lng, l.lat]).addTo(map)
      }

      // ── 景点常驻标记（今可亲访，不随唐图淡出；图钉名保留汉字） ──
      for (const p of POIS) {
        const wrap = document.createElement('div')
        const el = document.createElement('button')
        el.className = 'poi-marker'
        el.setAttribute('aria-label', tr(p.name, localeRef.current))
        const dot = document.createElement('span')
        dot.className = 'poi-marker-dot'
        const name = document.createElement('span')
        name.className = 'poi-marker-name tang-label-zoomgate'
        name.dataset.minzoom = '12.8'
        name.textContent = p.nameZh
        el.append(dot, name)
        el.addEventListener('click', ev => {
          ev.stopPropagation()
          new maplibregl.Popup({ closeButton: true, maxWidth: '320px', className: 'tang-popup-wrap' })
            .setLngLat([p.lng, p.lat]).setHTML(poiPopupHtml(p, localeRef.current, sRef.current)).addTo(map)
        })
        wrap.appendChild(el)
        new maplibregl.Marker({ element: wrap, anchor: 'top' }).setLngLat([p.lng, p.lat]).addTo(map)
      }
      const syncLabels = () => {
        const z = map.getZoom()
        document.querySelectorAll<HTMLElement>('.tang-label, .tang-label-zoomgate').forEach(el => {
          const mz = Number(el.dataset.minzoom)
          el.classList.toggle('tang-label-hidden', z < mz)
        })
      }
      map.on('zoom', syncLabels)
      syncLabels()
      applyOpacity(map, tRef.current)

      // ── 交互：点击任意处 → 唐代定位；点中唐迹点 → 讲解 ──
      map.on('click', e => {
        const sites = map.queryRenderedFeatures(e.point, { layers: ['tang-sites'] })
        if (sites.length && tRef.current > 0.05) {
          const name = (sites[0].properties as { name: string }).name
          new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
            .setLngLat(e.lngLat)
            .setHTML(sitePopupHtml(name, localeRef.current, sRef.current))
            .addTo(map)
          return
        }
        new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
          .setLngLat(e.lngLat)
          .setHTML(popupHtml(e.lngLat, localeRef.current, sRef.current))
          .addTo(map)
      })
      geolocate.on('geolocate', pos => {
        const ll = new maplibregl.LngLat(pos.coords.longitude, pos.coords.latitude)
        new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
          .setLngLat(ll).setHTML(popupHtml(ll, localeRef.current, sRef.current)).addTo(map)
      })

      // hover 高亮坊
      let hovered: number | null = null
      map.on('mousemove', 'tang-ward-fill', e => {
        map.getCanvas().style.cursor = 'pointer'
        const id = e.features?.[0]?.properties?.id as number | undefined
        if (id === undefined) return
        if (hovered !== null) map.setFeatureState({ source: 'wards', id: hovered }, { hover: false })
        hovered = id
        map.setFeatureState({ source: 'wards', id }, { hover: true })
      })
      map.on('mouseleave', 'tang-ward-fill', () => {
        map.getCanvas().style.cursor = ''
        if (hovered !== null) map.setFeatureState({ source: 'wards', id: hovered }, { hover: false })
        hovered = null
      })

      onMapReady?.(map)
    })

    return () => { map.remove(); mapRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 透明度联动（不依赖 isStyleLoaded——图块加载期间它会误报 false）
  useEffect(() => {
    tRef.current = t
    document.documentElement.style.setProperty('--tang-t', String(t))
    const map = mapRef.current
    if (map && map.getLayer('tang-silk')) applyOpacity(map, t)
  }, [t])

  // 飞到景点
  useEffect(() => {
    const map = mapRef.current
    if (!map || !flyToPoi) return
    map.flyTo({ center: [flyToPoi.lng, flyToPoi.lat], zoom: 14.6, duration: 1600, essential: true })
    new maplibregl.Popup({ closeButton: true, maxWidth: '320px', className: 'tang-popup-wrap' })
      .setLngLat([flyToPoi.lng, flyToPoi.lat])
      .setHTML(poiPopupHtml(flyToPoi, localeRef.current, sRef.current))
      .addTo(map)
  }, [flyToPoi])

  return <div ref={containerRef} className="map-container" />
}

function applyOpacity(map: maplibregl.Map, t: number) {
  document.documentElement.style.setProperty('--tang-t', String(t))
  // 幂次曲线：叠加段（t≈0.5）保持现代街道清晰可读，t→1 时唐图迅速变浓
  const tt = Math.pow(t, 1.6)
  for (const [id, max] of Object.entries(MAX_OPACITY)) {
    if (!map.getLayer(id)) continue
    const type = map.getLayer(id)!.type
    const prop = type === 'fill' ? 'fill-opacity' : type === 'line' ? 'line-opacity' : 'circle-opacity'
    map.setPaintProperty(id, prop, max * tt)
    if (type === 'circle') map.setPaintProperty(id, 'circle-stroke-opacity', max * tt)
  }
  // 唐图全开时，底图略微退后，避免文字打架
  if (map.getLayer('base')) map.setPaintProperty('base', 'raster-opacity', 1 - 0.35 * tt)
}
