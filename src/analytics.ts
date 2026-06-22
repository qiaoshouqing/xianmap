const GA_MEASUREMENT_ID = 'G-TB9173BTZN'

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

let initialized = false

function shouldTrack() {
  return import.meta.env.PROD && !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

function initGoogleAnalytics() {
  if (initialized || !shouldTrack()) return

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  initialized = true
}

export function trackPageView(path: string) {
  if (!shouldTrack()) return

  initGoogleAnalytics()
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_location: `${window.location.origin}${path}`,
    page_path: path,
    page_title: document.title,
  })
}
