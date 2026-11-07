import { useState } from 'react'
import { Page } from './bits'

const TARGET = ['100011010010', '010100100101', '001000001000']

export default function Rows() {
  const [grid, setGrid] = useState<boolean[][]>(() => TARGET.map(() => Array(12).fill(false)))
  const done = grid.every((row, r) => row.map((b) => (b ? '1' : '0')).join('') === TARGET[r])
  return (
    <Page eyebrow="3 × 12" title="Rows">
      <p className="lede">Black = 1.</p>
      <div className="card mt-8 grid gap-2">
        {grid.map((row, r) => (
          <div key={r} className="grid gap-2" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
            {row.map((on, c) => (
              <button key={c} aria-label={`row ${r + 1} col ${c + 1}`} aria-pressed={on}
                onClick={() => setGrid((g) => g.map((rw, i) => (i === r ? rw.map((v, j) => (j === c ? !v : v)) : rw)))}
                className={`aspect-square w-full rounded-md ${on ? 'bg-black ring-1 ring-white/40' : 'bg-white/90'}`} />
            ))}
          </div>
        ))}
      </div>
      {done && <p className="metal-text text-5xl font-semibold mt-10">QUARTZ</p>}
    </Page>
  )
}
