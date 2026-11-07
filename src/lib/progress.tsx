import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

// Completed puzzles are remembered only in this browser (localStorage). Nothing is sent anywhere.
const KEY = 'fdg-progress'
interface Progress { done: ReadonlySet<string>; markDone: (id: string) => void }
const Ctx = createContext<Progress>({ done: new Set(), markDone: () => {} })

const load = (): Set<string> => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return new Set(Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
  } catch {
    return new Set()
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<Set<string>>(load)
  const markDone = useCallback((id: string) => {
    setDone((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev).add(id)
      try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }, [])
  const value = useMemo(() => ({ done, markDone }), [done, markDone])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useProgress = () => useContext(Ctx)
