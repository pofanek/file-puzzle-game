import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { TOKENS } from '../puzzles/tokens'
import { Nothing } from '../secret/bits'

const pages: Record<string, ReturnType<typeof lazy>> = {
  [TOKENS.terminal]: lazy(() => import('../secret/Terminal')),
  [TOKENS.rows]: lazy(() => import('../secret/Rows')),
  [TOKENS.pyramid]: lazy(() => import('../secret/Pyramid')),
  [TOKENS.chain]: lazy(() => import('../secret/Chain')),
  [TOKENS.prism]: lazy(() => import('../secret/Prism')),
  [TOKENS.vault]: lazy(() => import('../secret/Vault')),
}

// Unknown tokens and unknown paths all render the same neutral page.
export default function Secret() {
  const { token = '' } = useParams()
  const Page = pages[token]
  if (!Page) return <Nothing />
  return <Suspense fallback={null}><Page /></Suspense>
}
