import { useEffect, type ReactNode } from 'react'
import { Eyebrow } from '../components/ui'

// A real DOM comment node (visible in the Elements panel, not in the page text).
export const Comment = ({ text }: { text: string }) => (
  <span hidden dangerouslySetInnerHTML={{ __html: `<!-- ${text.replace(/-->/g, '')} -->` }} />
)

export function useTitle(title: string, lang?: string) {
  useEffect(() => {
    const prev = document.title
    const prevLang = document.documentElement.lang
    document.title = title
    if (lang) document.documentElement.lang = lang
    return () => { document.title = prev; document.documentElement.lang = prevLang }
  }, [title, lang])
}

export const Page = ({ eyebrow, title, children }: { eyebrow?: string; title?: string; children: ReactNode }) => (
  <section className="section !pt-36">
    <div className="wrap max-w-[820px]">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && <h1 className="h2 !mt-4">{title}</h1>}
      {children}
    </div>
  </section>
)

export const Nothing = () => (
  <Page><p className="text-muted mono">404</p></Page>
)

export function saveText(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/octet-stream' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
