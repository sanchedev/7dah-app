import { Hymns } from '@/lib/hymns/hymns'

export function useHymn(hymnId: string | undefined) {
  return Hymns.get(hymnId ?? '')
}
