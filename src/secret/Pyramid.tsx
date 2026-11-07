import { Link, useParams } from 'react-router-dom'
import { LINKS } from '../puzzles/links'
import { TOKENS } from '../puzzles/tokens'
import { Nothing, Page } from './bits'

export default function Pyramid() {
  const rest = useParams()['*']?.split('/').filter(Boolean) ?? []
  const key = rest.join('/')
  if (key === 'tombraider') {
    const paste = LINKS.h5_pastebin2.replace(/^https?:\/\/(www\.)?pastebin\.com\//, '')
    return (
      <Page eyebrow="Tomb wall" title="Three carvings">
        <div className="card mt-8 grid gap-6 mono text-ink-2">
          <div>1 · 73 75 6e</div>
          <div>2 · pa_teb_n.com/{paste}</div>
          <div>3 · {btoa(TOKENS.pyramid)}</div>
          <p className="text-soft font-sans">Every wall is an address. The one that started it all will be last, the second will be in the middle, and the third will be first.</p>
        </div>
      </Page>
    )
  }
  if (key === 'dune/sun') {
    return (
      <Page eyebrow="Pyramid" title="">
        <p className="text-6xl sm:text-8xl text-center mt-10 select-all" style={{ color: '#d6b36a' }}>ᛋᚨᚾᛞᛋᛏᛟᚱᛗ</p>
      </Page>
    )
  }
  if (key === '') return <Page><Link to="tombraider" className="btn btn-ghost">…</Link></Page>
  return <Nothing />
}
