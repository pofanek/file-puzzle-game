import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LINKS } from '../puzzles/links'
import { Comment, Nothing, Page, saveText, useTitle } from './bits'

const RULES = `Level 1
Read everything on the page, even what you cannot see.
Selecting text is a kind of looking.
Level 2
Light has a source, and so does every page.
Comments are not shown, but they are there.
Level 3
Some things are in the way on purpose.
Pages are built from parts you can remove.`

const Dl = ({ href, label }: { href: string; label: string }) =>
  href ? <a className="btn btn-ghost" href={href} download target="_blank" rel="noopener noreferrer">{label}</a> : <p className="mono text-muted">(file missing)</p>

function Console() {
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    w.whatstheanswer = () => { console.log('orbit'); return 'orbit' }
    console.log('this page defines one function. its name is the question on the wall.')
    return () => { delete w.whatstheanswer }
  }, [])
  return null
}


// 26 white keys C3..G6 with the QWERTY letters printed on them (reading order Q..P, A..L, Z..M).
const KEY_LETTERS = 'QWERTYUIOPASDFGHJKLZXCVBNM'
const WHITE = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
function PianoKeys() {
  const w = 28
  const white = [...KEY_LETTERS].map((ch, i) => ({ ch, x: i * w, note: WHITE[i % 7], oct: 3 + Math.floor(i / 7) }))
  // a black key sits after every white key except E and B
  const black = white.filter((k) => k.note !== 'E' && k.note !== 'B' && k.x + w < 26 * w)
  return (
    <div className="card mt-8 overflow-x-auto">
      <svg viewBox={`0 0 ${26 * w} 130`} className="min-w-[640px] w-full" role="img" aria-label="piano keyboard, C3 to G6, with a letter on every white key">
        {white.map((k) => (
          <g key={k.x}>
            <rect x={k.x + 0.5} y={0} width={w - 1} height={110} rx={3} className="fill-white" />
            <text x={k.x + w / 2} y={100} textAnchor="middle" fontSize={13} className="fill-black" fontFamily="monospace">{k.ch}</text>
            {k.note === 'C' && <text x={k.x + w / 2} y={125} textAnchor="middle" fontSize={11} className="fill-white" fontFamily="monospace">C{k.oct}</text>}
          </g>
        ))}
        {black.map((k) => <rect key={k.x} x={k.x + w - 8} y={0} width={16} height={68} rx={2} className="fill-black" stroke="#555" strokeWidth={0.5} />)}
      </svg>
    </div>
  )
}

export default function Chain() {
  const slug = (useParams()['*'] ?? '').split('/')[0].toLowerCase()
  const title: Record<string, string> = { echo: 'R34D 7H3 73X7', c0mp455: 'execution', orbit: '58' }
  useTitle(title[slug] ?? '·')

  // Level 7: the tab icon is icon.png (a still of the GIF). The player turns it into icon.gif.
  useEffect(() => {
    if (slug !== 'orbit' || !LINKS.x1_gif) return
    const link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]') ?? document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }))
    const prev = { href: link.getAttribute('href'), type: link.getAttribute('type') }
    link.setAttribute('href', LINKS.x1_gif.replace(/\.gif$/, '.png'))
    link.setAttribute('type', 'image/png')
    return () => {
      if (prev.href) link.setAttribute('href', prev.href); else link.removeAttribute('href')
      if (prev.type) link.setAttribute('type', prev.type); else link.removeAttribute('type')
    }
  }, [slug])

  switch (slug) {
    case 'begin':
      return (
        <Page eyebrow="Level 1">
          <p className="lede">Some things are written in white.</p>
          <div style={{ height: 360 }} />
          <p className="select-all" style={{ color: '#000', background: '#000' }}>whisper</p>
        </Page>
      )
    case 'whisper':
      return (
        <Page eyebrow="Level 2">
          <Comment text="lantern" />
          <p className="lede">the source of light</p>
          <p className="text-4xl mt-8" aria-hidden>🏮</p>
        </Page>
      )
    case 'lantern':
      return (
        <Page eyebrow="Level 3">
          <div className="relative card mt-8 h-48 grid place-items-center">
            <p className="mono text-2xl">mosaic</p>
            <div id="overlay" className="absolute inset-0"
              style={{ background: 'repeating-conic-gradient(#222 0 25%, #555 0 50%) 0 0 / 28px 28px' }} />
          </div>
        </Page>
      )
    case 'mosaic':
      return (
        <Page>
          <h1 className="text-8xl font-semibold">404</h1>
          <p className="text-soft mt-2">Page Not Found</p>
          <div style={{ height: '320vh' }} />
          <p className="mono">the answer is echo</p>
        </Page>
      )
    case 'echo':
      return (
        <Page eyebrow="Level 5">
          <div className="card mt-8 grid gap-4"><span className="mono text-sm text-soft">compass.png</span>
            <button className="btn btn-ghost self-start" onClick={() => saveText('compass.png', '7H3 4N5W3R 15 C0MP455')}>download compass.png</button></div>
        </Page>
      )
    case 'c0mp455':
      return (
        <Page eyebrow="Level 6">
          <Console />
          <p className="lede">what's the answer?</p>
          <div className="card mt-8 mono grid gap-2"><span>IMAGERY</span><span>FUNCTIONALITY</span><span>ENTRY</span></div>
        </Page>
      )
    case 'orbit':
      return (
        <Page eyebrow="Level 7">
          <Comment text="python" />
          <p className="mono text-3xl">[:3]</p>
          <p className="text-5xl mt-6">👀 😕 🎁</p>
          <p className="text-soft mt-6">Some things are too quiet to see. Make them louder.</p>
        </Page>
      )
    case 'glacier':
      return (
        <Page eyebrow="Level 8">
          <Comment text="(2,1,5) (2,2,11) (3,2,31) (2,1,30) (1,2,11) (3,1,1) (3,2,13)" />
          <p className="lede">take a hint</p>
        </Page>
      )
    case 'tempest':
      return (
        <Page eyebrow="Level 9">
          <p className="lede">Six notes. The keys are the keys.</p>
          <PianoKeys />
          <div className="mt-8"><Dl href={LINKS.x1_mp3} label="download tempest.mp3" /></div>
        </Page>
      )
    case 'nebula':
      return (
        <Page eyebrow="Level 10">
          <p className="lede">A photo remembers more than it shows.</p>
          <div className="mt-8"><Dl href={LINKS.x1_sky} label="download sky" /></div>
        </Page>
      )
    case 'starlight':
      return <Page><p className="metal-text text-5xl font-semibold">GG. Your key: starlight</p></Page>
    case 'rules':
      return <Page eyebrow="Rules"><pre className="code mt-8">{RULES}</pre></Page>
    default:
      return <Nothing />
  }
}
