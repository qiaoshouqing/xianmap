import { useLocale } from '../i18n'

interface Props {
  t: number
  onChange: (t: number) => void
}

export default function ControlDock({ t, onChange }: Props) {
  const { t: s } = useLocale()
  const presets = [
    { label: '今', value: 0, hint: s.presetNow },
    { label: '叠', value: 0.55, hint: s.presetOverlay },
    { label: '唐', value: 1, hint: s.presetTang },
  ]

  return (
    <div className="dock">
      <div className="dock-presets">
        {presets.map(p => (
          <button
            key={p.label}
            className={`dock-preset ${Math.abs(t - p.value) < 0.08 ? 'active' : ''}`}
            title={p.hint}
            aria-label={p.hint}
            onClick={() => onChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="dock-slider">
        <span className="dock-end dock-end-now">{s.endNow}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          aria-label={s.sliderAria}
          onChange={e => onChange(Number(e.target.value))}
        />
        <span className="dock-end dock-end-tang">{s.endTang}</span>
      </div>
      <div className="dock-caption">{s.dockCaption}</div>
    </div>
  )
}
