import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useGoTo } from '../lib/scroll'

const Mark = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="text-ink-2">
    <path d="M12 2 21 7v10l-9 5-9-5V7z" /><path d="M12 2v20M3 7l18 10M21 7 3 17" opacity=".5" />
  </svg>
)

type Theme = 'dark' | 'light'
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'light') document.documentElement.dataset.theme = 'light'
    else delete document.documentElement.dataset.theme
    try { localStorage.setItem('fdg-theme', next) } catch { /* ignore */ }
  }
  return { theme, toggle }
}

const Sun = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)
const Moon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
)

export function Nav() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggle } = useTheme()
  const goTo = useGoTo()
  const tab = 'text-[12.5px] sm:text-[13.5px] px-2.5 sm:px-4 py-2 rounded-full transition-colors whitespace-nowrap'
  const link = `${tab} text-muted hover:text-ink-2`
  return (
    <nav className="pill fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-[920px] justify-between gap-1 !pl-3 sm:!pl-6">
      <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight shrink-0"><Mark /><span className="hidden lg:inline">File Decryption Game</span></Link>
      <div className="flex gap-0.5 sm:gap-1 min-w-0">
        <button className={link} onClick={() => goTo('top')}>{t('nav.start')}</button>
        <button className={link} onClick={() => goTo('play')}>{t('nav.play')}</button>
        <button className={link} onClick={() => goTo('finish')}>{t('finish.title')}</button>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button className="mono text-xs text-soft px-2.5 py-2 rounded-full hover:bg-[rgb(var(--w)/0.1)]" onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')} aria-label="language">
          {lang === 'pl' ? 'PL' : 'EN'}
        </button>
        <button className="text-soft w-9 h-9 grid place-items-center rounded-full hover:bg-[rgb(var(--w)/0.1)]" onClick={toggle} aria-label={t('nav.theme')} title={t('nav.theme')}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </div>
    </nav>
  )
}

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="wrap pb-10">
      <div className="surface !rounded-[48px] px-8 py-10 text-center">
        <p className="text-soft text-sm">{t('footer.note')}</p>
        <p className="mono text-xs text-muted mt-3">File Decryption Game</p>
      </div>
    </footer>
  )
}
