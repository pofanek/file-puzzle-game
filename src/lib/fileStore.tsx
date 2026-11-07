import { createContext, useContext, useState, type ReactNode } from 'react'

const Ctx = createContext<{ file: File | null; setFile: (f: File | null) => void }>(null!)
export function FileProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null)
  return <Ctx.Provider value={{ file, setFile }}>{children}</Ctx.Provider>
}
export const useFile = () => useContext(Ctx)
