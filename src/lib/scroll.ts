import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Navigate to the home page and scroll to a section id (HashRouter has no real #anchors). */
export function useGoTo() {
  const nav = useNavigate()
  return (id: string) => nav('/', { state: { scroll: id } })
}

/** Home page: scroll to the section named in the navigation state. */
export function useScrollFromState() {
  const loc = useLocation()
  const id = (loc.state as { scroll?: string } | null)?.scroll
  useEffect(() => {
    if (!id) return
    const timer = setTimeout(() => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      if (id === 'top') return scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }, 60)
    return () => clearTimeout(timer)
  }, [id, loc.key])
}
