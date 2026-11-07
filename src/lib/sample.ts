import { useEffect, useState } from 'react'
import type { Level } from '../puzzles/registry'

/** Author-supplied originals: public/samples/index.json maps a level to a file name in public/samples/. */
type Index = Partial<Record<Level, string>>
let indexPromise: Promise<Index> | null = null
const loadIndex = (): Promise<Index> => (indexPromise ??= fetch(`${import.meta.env.BASE_URL}samples/index.json`)
  .then((r): Promise<Index> => (r.ok ? r.json() : Promise.resolve({})))
  .catch((): Index => ({})))

export type SampleState = { status: 'loading' } | { status: 'missing' } | { status: 'ok'; name: string; load: () => Promise<Uint8Array> }

export function useSample(level: Level): SampleState {
  const [state, setState] = useState<SampleState>({ status: 'loading' })
  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
    loadIndex().then((idx) => {
      if (!live) return
      const name = idx[level]
      if (!name) return setState({ status: 'missing' })
      setState({
        status: 'ok', name,
        load: async () => {
          const r = await fetch(`${import.meta.env.BASE_URL}samples/${encodeURIComponent(name)}`)
          if (!r.ok) throw new Error('sample')
          return new Uint8Array(await r.arrayBuffer())
        },
      })
    })
    return () => { live = false }
  }, [level])
  return state
}
