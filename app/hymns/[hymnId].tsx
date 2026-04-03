import HymnPlayer from '@/components/hymn/player/player'
import { useHymn } from '@/hooks/hymn/hymn'
import { router, useLocalSearchParams } from 'expo-router'

export default function HymnScreen() {
  const { hymnId, playlistId } = useLocalSearchParams<{
    hymnId: string
    playlistId?: string
  }>()

  const hymn = useHymn(typeof hymnId !== 'string' ? undefined : hymnId)

  if (hymn == null) {
    router.replace('/')
    return null
  }

  return <HymnPlayer hymn={hymn} playlistId={playlistId} />
}
