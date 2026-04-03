import { PlaylistViewer } from '@/components/playlist/playlist-viewer'
import { usePlaylist } from '@/hooks/audio/playlist'
import { router, useLocalSearchParams } from 'expo-router'

export default function PlaylistScreen() {
  const { playlistId } = useLocalSearchParams()

  const playlist = usePlaylist(
    typeof playlistId !== 'string' ? null : playlistId,
  )

  if (playlist == null) {
    router.replace('/')
    return null
  }

  return <PlaylistViewer playlist={playlist} />
}
