import { useEffect, useState } from 'react'
import { Dropzone, Eyebrow, Modal, Reveal, Spoiler } from '../components/ui'
import { useI18n, type Key } from '../lib/i18n'
import { useFile } from '../lib/fileStore'
import { useGoTo, useScrollFromState } from '../lib/scroll'
import { useSample } from '../lib/sample'
import { extOf } from '../lib/check'
import { REPAIR, generatePack, zipName } from '../lib/generate'
import { download } from '../lib/zip'
import { LEVELS, PUZZLES, isReady, missingLinks, type Level, type Puzzle } from '../puzzles/registry'
import { useProgress } from '../lib/progress'
import FinishSection from './FinishSection'

type Source = 'author' | 'own'

export default function Start() {
  const { t } = useI18n()
  const { file, setFile } = useFile()
  const goTo = useGoTo()
  const { done } = useProgress()
  const [level, setLevel] = useState<Level>('easy')
  const [selId, setSelId] = useState<string | null>(null)
  useScrollFromState()

  const list = PUZZLES.filter((p) => p.level === level)
  const selected = PUZZLES.find((p) => p.id === selId && p.level === level) ?? null

  return (
    <>
      <header className="section !pt-40 !pb-16 relative"><div className="hero-glow" />
        <div className="wrap">
          <Reveal><Eyebrow>{t('hero.eyebrow')}</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h1 className="h1">{t('hero.title1')}<br /><span className="accent-text">{t('hero.title2')}</span></h1>
          </Reveal>
          <Reveal delay={0.16}><p className="lede">{t('hero.lede')}</p></Reveal>
          <Reveal delay={0.24} className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="card lvl-card flex flex-col justify-between" style={{ ['--c' as string]: '74 222 128' }}>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{t('mode.play')}</h3>
                <p className="text-soft text-[15px] mt-1">{t('mode.playDesc')}</p>
              </div>
              <button className="btn btn-metal btn-lg mt-8 self-start" onClick={() => goTo('play')}>
                {t('nav.play')} <span className="arrow">→</span>
              </button>
            </div>
            <div className="card lvl-card" style={{ ['--c' as string]: '96 165 250' }}>
              <h3 className="text-xl font-semibold tracking-tight">{t('mode.own')}</h3>
              <p className="text-soft text-[15px] mt-1 mb-6">{t('mode.ownDesc')}</p>
              <Dropzone file={file} onFile={setFile} />
            </div>
          </Reveal>
        </div>
      </header>

      <section id="play" className="section !pt-16 scroll-mt-4" data-level={level}>
        <div className="wrap">
          <Reveal>
            <Eyebrow>{t('pick.eyebrow')}</Eyebrow>
            <h2 className="h2">{t('pick.title')} <span className="metal-text">{t('pick.title2')}</span></h2>
          </Reveal>
          <div className="pill mt-4 mb-6 flex-wrap" role="tablist">
            {LEVELS.map((l) => (
              <button key={l} role="tab" data-level={l} aria-selected={l === level} className={`tab tab-lvl ${l === level ? 'tab-active' : ''}`} onClick={() => setLevel(l)}>
                <span className="lvl-dot" />{t(`level.${l}` as Key)}
                <span className="mono text-[11px] text-muted">{PUZZLES.filter((p) => p.level === l && done.has(p.id)).length}/5</span>
              </button>
            ))}
          </div>
          <p className="text-soft mb-8">{t(`level.${level}Desc` as Key)}</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => {
              const ready = isReady(p)
              const on = p.id === selected?.id
              return (
                <PuzzleCard key={p.id} p={p} index={i} ready={ready} on={on} complete={done.has(p.id)} onPick={() => setSelId(p.id)} />
              )
            })}
          </div>
          {selected && <Panel key={selected.id} p={selected} />}
        </div>
      </section>

      <FinishSection />
    </>
  )
}

function PuzzleCard({ p, index, ready, on, complete, onPick }: { p: Puzzle; index: number; ready: boolean; on: boolean; complete: boolean; onPick: () => void }) {
  const { t, lang } = useI18n()
  return (
    <button
      data-level={p.level}
      aria-pressed={on}
      onClick={onPick}
      className={`card lvl-card text-left ${on ? 'lvl-card-selected' : ''} ${complete ? 'card-done' : ''} ${ready ? 'card-hover' : 'opacity-60'}`}
    >
      {complete
        ? <span className="done-check" role="img" aria-label={t('progress.completed')}>✓</span>
        : <span className="absolute top-8 right-8 mono text-xs text-faint">0{index + 1}</span>}
      <h3 className="text-[21px] font-semibold tracking-tight flex items-center gap-3"><span className="lvl-dot" />{p.name}</h3>
      <p className="text-soft text-[15px] mt-2 min-h-[48px]">{p.teaser[lang]}</p>
      <div className="flex flex-wrap gap-2 mt-6">
        <span className="badge lvl-badge">{p.layers} {t('layers')}</span>
        {p.external.map((e) => <span key={e} className="badge">{e}</span>)}
        {!ready && <span className="badge">{t('soon')}</span>}
      </div>
    </button>
  )
}

/** Opens under the puzzle cards: pick the source file, generate the ZIP, read the hints. */
function Panel({ p }: { p: Puzzle }) {
  const { t, lang } = useI18n()
  const { file } = useFile()
  const goTo = useGoTo()
  const sample = useSample(p.level)
  const [source, setSource] = useState<Source>(file ? 'own' : 'author')
  const [textLang, setTextLang] = useState(lang)
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle')
  const [done, setDone] = useState(false)

  useEffect(() => { if (file) setSource('own') }, [file])

  const missing = missingLinks(p)
  const authorOk = sample.status === 'ok'
  const sourceName = source === 'own' ? file?.name : authorOk ? sample.name : undefined
  const usable = source === 'own' ? !!file : authorOk
  const ext = sourceName ? extOf(sourceName) || '(none)' : null

  const go = async () => {
    if (!usable || missing.length) return
    setState('busy')
    try {
      const name = source === 'own' ? file!.name : (sample as { name: string }).name
      const bytes = source === 'own' ? new Uint8Array(await file!.arrayBuffer()) : await (sample as { load: () => Promise<Uint8Array> }).load()
      download(await generatePack(p, name, bytes, textLang), zipName(name))
      setState('idle')
      setDone(true)
    } catch {
      setState('error')
    }
  }

  const hints = [...p.hints, REPAIR[p.level][lang]]
  if ((p.level === 'hard' || p.level === 'extreme') && ext) hints.push(`${t('hints.ext')}: .${ext}`)

  return (
    <div data-level={p.level} className="card lvl-card lvl-card-selected mt-10 grid gap-10 lg:grid-cols-2">
      <div className="grid gap-6 content-start">
        <div>
          <Eyebrow>{t(`level.${p.level}` as Key)}</Eyebrow>
          <h3 className="h2 !text-[34px] !mt-3 !mb-1">{p.name}</h3>
          <p className="text-soft">{p.teaser[lang]}</p>
        </div>

        <div>
          <p className="text-sm text-soft mb-3">{t('src.title')}</p>
          <div className="pill">
            {(['author', 'own'] as const).map((s) => (
              <button key={s} className={`tab tab-lvl ${source === s ? 'tab-active' : ''}`} onClick={() => setSource(s)}>
                {t(s === 'author' ? 'src.author' : 'src.own')}
              </button>
            ))}
          </div>
          <p className="mono text-xs text-muted mt-3 min-h-4">
            {source === 'own' ? (file ? file.name : t('src.noOwn')) : sample.status === 'missing' ? t('src.missing') : sample.status === 'ok' ? sample.name : ''}
          </p>
        </div>

        <div>
          <p className="text-sm text-soft mb-3">{t('create.langLabel')}</p>
          <div className="pill">
            {(['pl', 'en'] as const).map((l) => (
              <button key={l} className={`tab tab-lvl ${textLang === l ? 'tab-active' : ''}`} onClick={() => setTextLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted">{t('create.contains')}</p>
        {missing.length > 0 && <div className="code">{t('create.locked')}{'\n'}{missing.join(', ')}</div>}
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn lvl-btn btn-lg" disabled={!usable || missing.length > 0 || state === 'busy'} onClick={go}>
            {state === 'busy' ? t('create.working') : t('create.generate')} <span className="arrow">↓</span>
          </button>
          {state === 'error' && <span className="text-soft text-sm">{t('create.error')}</span>}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold tracking-tight">{t('hints.title')}</h4>
        <p className="text-soft text-sm mt-1 mb-5">{t('hints.lede')}</p>
        <div className="grid gap-3">
          {hints.map((h, i) => (
            <Spoiler key={i} label={`${i < p.hints.length ? `${t('hints.n')} ${i + 1}` : i === p.hints.length ? t('hints.repair') : t('hints.ext')} · ${t('hints.reveal')}`}>
              {h}
            </Spoiler>
          ))}
        </div>
      </div>

      {done && (
        <Modal title={t('done.title')} onClose={() => setDone(false)}>
          <p className="text-soft text-[15px] mt-3">{t('done.text')}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button className="btn btn-metal" onClick={() => { setDone(false); goTo('finish') }}>{t('done.finish')} <span className="arrow">→</span></button>
            <button className="btn btn-ghost" onClick={() => setDone(false)}>{t('done.close')}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
