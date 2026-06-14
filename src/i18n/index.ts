import { createContext, useContext } from 'react'
import type { UIStrings } from './ui'

export const LOCALES = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
}

/** 多语字段：英文为基准，缺失时回退 en → zh-CN */
export type L10n = Partial<Record<Locale, string>>

export function tr(field: L10n | string | undefined, locale: Locale): string {
  if (field == null) return ''
  if (typeof field === 'string') return field
  return field[locale] ?? field.en ?? field['zh-CN'] ?? Object.values(field)[0] ?? ''
}

export const STORAGE_KEY = 'changan-locale'

export function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved && LOCALES.includes(saved)) return saved
  const navs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const raw of navs) {
    const l = raw.toLowerCase()
    if (l.startsWith('zh')) return /tw|hk|mo|hant/.test(l) ? 'zh-TW' : 'zh-CN'
    if (l.startsWith('ja')) return 'ja'
    if (l.startsWith('ko')) return 'ko'
    if (l.startsWith('en')) return 'en'
  }
  return 'en' // 全球默认英文
}

export interface LocaleCtx {
  locale: Locale
  setLocale: (l: Locale) => void
  t: UIStrings
}

export const LocaleContext = createContext<LocaleCtx | null>(null)

export function useLocale(): LocaleCtx {
  const c = useContext(LocaleContext)
  if (!c) throw new Error('useLocale must be used within LocaleProvider')
  return c
}

export { UI } from './ui'
export { LocaleProvider } from './LocaleProvider'
