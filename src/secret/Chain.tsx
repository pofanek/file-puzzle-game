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
    return () => { delete w.whatstheanswer }
  }, [])
  return null
}

export default function Chain() {
  const slug = (useParams()['*'] ?? '').split('/')[0].toLowerCase()
  const title: Record<string, string> = { echo: 'R34D 7H3 73X7', compass: 'execution', orbit: '58' }
  useTitle(title[slug] ?? '·')

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
    case 'compass':
      return (
        <Page eyebrow="Level 6">
          <Console />
          <div className="card mt-8 mono grid gap-2"><span>IMAGERY</span><span>FUNCTIONALITY</span><span>ENTRY</span></div>
        </Page>
      )
    case 'orbit':
      return (
        <Page eyebrow="Level 7">
          <Comment text="python" />
          <p className="mono text-3xl">[:3]</p>
          <p className="text-5xl mt-6">👀 😕 🎁</p>
          <div className="mt-8"><Dl href={LINKS.x1_gif} label="download icon" /></div>
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
          <p className="lede">empty three? peon, gee!</p>
          <div className="mt-8"><Dl href={LINKS.x1_mp3} label="download tempest" /></div>
        </Page>
      )
    case 'nebula':
      return (
        <Page eyebrow="Level 10">
          <p className="lede">Look closely.</p>
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
