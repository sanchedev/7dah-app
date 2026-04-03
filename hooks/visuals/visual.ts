import { Visuals } from '@/lib/visuals/visuals'
import { useMemo } from 'react'

export function useVisual(id: string | undefined) {
  const visual = useMemo(() => {
    if (id == null) return
    return Visuals.getId(id)
  }, [id])

  return visual
}

export function useVisualFromHymnId(hymnId: string | undefined) {
  const visual = useMemo(() => {
    if (hymnId == null) return
    return Visuals.getFromHymnId(hymnId)
  }, [hymnId])

  return visual
}
