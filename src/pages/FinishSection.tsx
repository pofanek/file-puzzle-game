import { useState } from 'react'
import { Confetti, Dropzone, Eyebrow } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { useProgress } from '../lib/progress'
import { byId } from '../puzzles/registry'
import { decodeCheck, verifyUpload, type Verdict } from '../lib/check'

export default function FinishSection() {
  const { t } = useI18n()
  const { markDone } = useProgress()
  const [checkFile, setCheckFile] = useState<File | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [verdict, setVerdict] = useState<Verdict | 'badCheck' | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!checkFile || !file) return
    setBusy(true)
    const check = decodeCheck(await checkFile.text())
    if (!check) setVerdict('badCheck')
    else {
      const v = await verifyUpload(check, new Uint8Array(await file.arrayBuffer()), file.name)
      if (v.status === 'solved' && v.puzzleId && byId(v.puzzleId)) markDone(v.puzzleId)
      setVerdict(v)
    }
    setBusy(false)
  }

  return (
    <section id="finish" className="section scroll-mt-4">
      <div className="wrap max-w-[820px]">
        <Eyebrow>{t('nav.finish')}</Eyebrow>
        <h1 className="h2 !mt-4">{t('finish.title')}</h1>
        <p className="lede">{t('finish.lede')}</p>
        <p className="text-sm text-muted mt-3 max-w-[580px]">{t('finish.optional')}</p>
        <div className="card mt-10 grid gap-6">
          <div><p className="text-sm text-soft mb-3">{t('finish.check')}</p><Dropzone file={checkFile} onFile={(f) => { setCheckFile(f); setVerdict(null) }} compact accept=".txt" /></div>
          <div><p className="text-sm text-soft mb-3">{t('finish.file')}</p><Dropzone file={file} onFile={(f) => { setFile(f); setVerdict(null) }} compact /></div>
          <button className="btn btn-metal btn-lg self-start" disabled={!checkFile || !file || busy} onClick={run}>{t('finish.verify')} <span className="arrow">→</span></button>
          {verdict === 'badCheck' && <div className="code">{t('finish.badCheck')}</div>}
          {verdict && verdict !== 'badCheck' && (
            verdict.status === 'solved' ? (
              <>
              <Confetti />
              <div className="solved" role="status">
                <span className="solved-title">{t('finish.solved')}</span>
                <p className="text-ink-2 mt-3">{verdict.exact ? t('finish.solvedExact') : t('finish.solvedClose')}</p>
                {verdict.puzzleId && byId(verdict.puzzleId) && <p className="text-sm mt-2 done-text">✓ {byId(verdict.puzzleId)!.name} — {t('progress.saved')}</p>}
                <p className="mono text-sm text-soft mt-2">{t('finish.original')}: <span className="text-ink">{verdict.originalName}</span></p>
              </div>
              </>
            ) : (
              <div className="code" role="status">{t('finish.no')}{'\n'}{verdict.hint}</div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
