import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { trackPageView } from '../analytics'

export default function AnalyticsPageView() {
  const href = useRouterState({ select: state => state.location.href })
  const lastHref = useRef<string | null>(null)

  useEffect(() => {
    if (lastHref.current === href) return
    lastHref.current = href
    trackPageView(href)
  }, [href])

  return null
}
