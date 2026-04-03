import { Visual } from '@/lib/visuals/types'
import { Visuals } from '@/lib/visuals/visuals'
import { useEffect, useState } from 'react'

export function useVisual(id: string | undefined) {
  const [visual, setVisual] = useState<Visual>()

  useEffect(() => {
    if (id == null) return
    Visuals.getId(id).then(setVisual)
  }, [id])

  return visual
}

export function useVisualFromHymnId(hymnId: string | undefined) {
  const [visual, setVisual] = useState<Visual>()

  useEffect(() => {
    if (hymnId == null) return
    Visuals.getFromHymnId(hymnId).then(setVisual)
  }, [hymnId])

  return visual
}
