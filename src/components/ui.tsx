import { useEffect, useRef, useState, type ReactNode, type DragEvent } from 'react'
import { useI18n } from '../lib/i18n'

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ ['--d' as string]: `${delay}s` }}>{children}</div>
}

export const Eyebrow = ({ children }: { children: ReactNode }) => <div className="eyebrow">{children}</div>

export function Dropzone({ file, onFile, compact = false, accept }: { file: File | null; onFile: (f: File) => void; compact?: boolean; accept?: string }) {
  const { t } = useI18n()
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const drop = (e: DragEvent) => {
    e.preventDefault()
    setOver(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }
  return (
    <div
      className={`dropzone ${over ? 'dropzone-over' : ''} ${compact ? 'p-6' : 'p-10 sm:p-14'} text-center cursor-pointer`}
      onClick={() => input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      <input ref={input} type="file" hidden accept={accept} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      {file ? (
        <>
          <div className="eyebrow justify-center">{t('drop.chosen')}</div>
          <p className="mono mt-3 text-ink break-all">{file.name}</p>
          <p className="mono text-xs text-muted mt-1">{(file.size / 1024).toFixed(1)} KB · {t('drop.change')}</p>
        </>
      ) : (
        <>
          <p className="text-xl font-semibold tracking-tight">{t('drop.title')}</p>
          <p className="text-sm text-muted mt-2">{t('drop.or')}</p>
        </>
      )}
    </div>
  )
}

/** Discord-style spoiler: hidden until clicked. */
export function Spoiler({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      className={`spoiler text-[15px] ${open ? '' : 'spoiler-hidden'}`}
      data-label={label}
      aria-expanded={open}
      onClick={() => setOpen(true)}
    >
      <span>{children}</span>
    </button>
  )
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', h)
    return () => removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="card max-w-[480px] w-full !bg-[var(--bg)]" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        {children}
      </div>
    </div>
  )
}

const COLORS = ['#4ade80', '#facc15', '#f87171', '#60a5fa', '#c084fc', '#f472b6', '#fb923c', '#2dd4bf']

/** One-second confetti burst on a full-screen canvas. Skipped for reduced motion. */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = c.getContext('2d')!
    const dpr = devicePixelRatio || 1
    const w = (c.width = innerWidth * dpr), h = (c.height = innerHeight * dpr)
    const parts = Array.from({ length: 160 }, (_, i) => {
      const side = i % 2 ? 1 : -1
      return {
        x: w / 2 + side * w * 0.15 * Math.random(), y: h * 0.45,
        vx: (Math.random() * 9 + 2) * side * dpr * (Math.random() < 0.5 ? 1 : -1) * 0.8,
        vy: -(Math.random() * 16 + 6) * dpr,
        s: (Math.random() * 7 + 5) * dpr, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
        col: COLORS[i % COLORS.length],
      }
    })
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = now - start
      ctx.clearRect(0, 0, w, h)
      const fade = Math.max(0, 1 - Math.max(0, t - 1200) / 600)
      for (const q of parts) {
        q.vy += 0.5 * dpr; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.r += q.vr
        ctx.save(); ctx.globalAlpha = fade; ctx.translate(q.x, q.y); ctx.rotate(q.r)
        ctx.fillStyle = q.col; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); ctx.restore()
      }
      if (t < 1800) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, w, h)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} aria-hidden className="fixed inset-0 w-full h-full pointer-events-none z-[70]" />
}
