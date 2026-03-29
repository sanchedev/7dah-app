import { PlaylistViewer } from '@/components/playlist/playlist-viewer'
import { usePlaylist } from '@/hooks/audio/playlist'
import { useColors } from '@/hooks/colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'

export default function PlaylistScreen() {
  const colors = useColors()
  const { playlistId } = useLocalSearchParams()

  const router = useRouter()

  const playlist = usePlaylist(
    typeof playlistId !== 'string' ? null : playlistId,
  )

  if (playlist == null) {
    router.replace('/')
    return null
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PlaylistViewer playlist={playlist} />
    </View>
  )
}
