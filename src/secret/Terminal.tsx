import { useRef, useState } from 'react'
import { LINKS } from '../puzzles/links'
import { useTitle } from './bits'

const HELP = 'DRSXQC YXVI QOD RKBNOB PBYW ROBO. IYEB PSBCD MYWWKXN SC DRO MYVYEB YP WI MEBCYB.'
const AMBER = 'FILE SPACE LOW. CONDENSING. <  ODD. NUM.  >  EVEN. NUM - 1.  WRAP AROUND. LOOK DOWN!\ni3t2u4i6b1s1w5a1i3'

export default function Terminal() {
  useTitle('~')
  const [lines, setLines] = useState<string[]>(['type help'])
  const [val, setVal] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const run = (cmd: string) => {
    const c = cmd.trim().toLowerCase()
    let out = 'unknown command'
    if (c === 'help') out = HELP
    else if (c === 'amber') out = AMBER
    else if (c === 'vault') out = (LINKS.h3_imgur || '(link missing)') + '\nthe old numbers count the alphabet.'
    setLines((l) => [...l, `> ${cmd}`, out])
    setVal('')
    setTimeout(() => end.current?.scrollIntoView(), 0)
  }
  return (
    <section className="min-h-screen bg-black pt-32 px-6">
      <div className="mx-auto max-w-[760px] mono text-sm whitespace-pre-wrap break-words" style={{ color: '#FFB000' }}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
        <form onSubmit={(e) => { e.preventDefault(); run(val) }} className="flex gap-2 items-center">
          <span>{'>'}</span>
          <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} spellCheck={false} autoComplete="off"
            className="flex-1 bg-transparent outline-none mono" style={{ color: '#FFB000', caretColor: '#FFB000' }} aria-label="command" />
        </form>
        <div ref={end} />
      </div>
    </section>
  )
}
