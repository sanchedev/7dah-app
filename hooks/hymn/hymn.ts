import { Hymns } from '@/lib/hymns/hymns'
import { useMemo } from 'react'

export function useHymn(hymnId: string | undefined) {
  const hymn = useMemo(() => {
    if (hymnId == null) return
    return Hymns.get(hymnId)
  }, [hymnId])

  return hymn
}
