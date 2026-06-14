import { Link } from '@tanstack/react-router'
import { useLocale } from '../i18n'

export default function KaoPage() {
  const { t } = useLocale()
  const k = t.kao
  return (
    <div className="kao-page">
      <article className="kao-paper">
        <Link to="/" className="kao-back">{k.back}</Link>
        <h1>{k.title}</h1>
        <p className="kao-lede">{k.lede}</p>

        <h2>{k.h1}</h2>
        <ul>
          {k.sources.map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        <h2>{k.h2}</h2>
        <p>{k.anchorsIntro}</p>
        <ul>
          {k.anchors.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
        <p>{k.verify}</p>

        <h2>{k.h3}</h2>
        <ul>
          {k.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>

        <p className="kao-colophon">{k.colophon}</p>
      </article>
    </div>
  )
}
