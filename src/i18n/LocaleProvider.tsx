import { useEffect, useState, type ReactNode } from 'react'
import { LocaleContext, STORAGE_KEY, detectLocale, type Locale } from './index'
import { UI } from './ui'

export function LocaleProvider({ children }: { children: ReactNode }) {
  // 惰性初始化：首帧即读取浏览器语言 / 已保存偏好，避免闪烁
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  useEffect(() => {
    document.documentElement.lang =
      locale === 'zh-CN' ? 'zh-Hans' : locale === 'zh-TW' ? 'zh-Hant' : locale
  }, [locale])

  const setLocale = (l: Locale) => {
    localStorage.setItem(STORAGE_KEY, l)
    setLocaleState(l)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: UI[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}
