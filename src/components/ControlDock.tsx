interface Props {
  t: number
  onChange: (t: number) => void
}

const PRESETS: { label: string; value: number; hint: string }[] = [
  { label: '今', value: 0, hint: '现代西安' },
  { label: '叠', value: 0.55, hint: '双城对照' },
  { label: '唐', value: 1, hint: '大唐长安' },
]

export default function ControlDock({ t, onChange }: Props) {
  return (
    <div className="dock">
      <div className="dock-presets">
        {PRESETS.map(p => (
          <button
            key={p.label}
            className={`dock-preset ${Math.abs(t - p.value) < 0.08 ? 'active' : ''}`}
            title={p.hint}
            onClick={() => onChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="dock-slider">
        <span className="dock-end dock-end-now">今 · 西安</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          aria-label="时空滑杆：在现代西安与唐代长安之间切换"
          onChange={e => onChange(Number(e.target.value))}
        />
        <span className="dock-end dock-end-tang">唐 · 長安</span>
      </div>
      <div className="dock-caption">拖动铜钱，穿越一千三百年</div>
    </div>
  )
}
