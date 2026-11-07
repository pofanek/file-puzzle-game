import { useState } from 'react'
import { LINKS } from '../puzzles/links'
import { Page } from './bits'

const SQ = ['ABC', '', '', '', '', '', '', '', 'YZ_']
const MODULES = [
  { id: 1, code: '3578694' },
  { id: 2, code: 'acrobatic' },
  { id: 3, code: '781619' },
  { id: 4, code: '1320' },
  { id: 5, code: '734618' },
  { id: 6, code: 'gravity' },
]

export default function Vault() {
  const [vals, setVals] = useState<string[]>(Array(6).fill(''))
  const ok = MODULES.map((m, i) => vals[i].trim().toLowerCase() === m.code)
  const set = (i: number, v: string) => setVals((a) => a.map((x, j) => (j === i ? v : x)))
  const Lamp = ({ s }: { s: string }) => (
    <div className="flex gap-1.5">{[...s].map((c, i) => <i key={i} className={`h-5 w-5 rounded-full ${c === '1' ? 'bg-amber-400' : 'bg-white/10'}`} />)}</div>
  )
  const mods = [
    <div key={1}>Image: {LINKS.x3_imgur_rainbow}<p className="text-soft mt-2">hint: subtract</p></div>,
    <div key={2} className="grid gap-3">
      <div className="grid grid-cols-3 gap-1 w-48">{SQ.map((s, i) => <div key={i} className="border border-white/20 rounded p-2 mono text-xs h-10 text-center">{s}</div>)}</div>
      <div className="mono">11 13 63 53 12 11 + tic</div>
    </div>,
    <div key={3}><div className="mono">3 &nbsp; 6 &nbsp; 7 &nbsp; 9</div><p className="text-soft mt-2">A hailstone falls, climbs, falls again. How many steps until it lands on 1?</p></div>,
    <div key={4} className="grid gap-2"><Lamp s="1100" /><Lamp s="1110" /><Lamp s="11110000000" /><Lamp s="0000" /></div>,
    <div key={5}>Image: {LINKS.x3_imgur_mayan}</div>,
    <div key={6} className="mono text-xl">Htsboyu<p className="text-soft text-sm font-sans mt-2">1 left, keep shift</p></div>,
  ]
  return (
    <Page eyebrow="Vault" title="Six locks">
      <div className="grid gap-5 mt-8">
        {MODULES.map((m, i) => (
          <div key={m.id} className="card grid gap-4">
            <div className="flex justify-between"><span className="eyebrow">Module {m.id}</span><span className="mono text-xs">{ok[i] ? 'OPEN' : 'LOCKED'}</span></div>
            {mods[i]}
            <input className="field mono" value={vals[i]} onChange={(e) => set(i, e.target.value)} aria-label={`module ${m.id}`} spellCheck={false} />
          </div>
        ))}
      </div>
      {ok.every(Boolean) && <p className="metal-text text-4xl font-semibold mt-10">You reached Time itself. Key: chronos</p>}
    </Page>
  )
}
