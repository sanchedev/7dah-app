import { usePlaylists } from '@/hooks/audio/playlists'
import { Playlists } from '@/lib/audio/playlists'
import { Playlist } from '@/lib/audio/types'
import { Hymn } from '@/lib/types'
import { getVisualAsset } from '@/lib/visuals'
import { Image } from 'react-native'
import { BottomSheet } from '../ui/bottom-sheet'
import { ListItem } from '../ui/list-item'

export function AddToPlaylist({
  hymn,
  visible,
  onClose,
}: {
  hymn: Hymn
  visible: boolean
  onClose: () => void
}) {
  const playlists = usePlaylists().filter(
    (p) => !p.hymns.some((h) => h.number === hymn.number),
  )

  const playlistSelected = async (playlist: Playlist) => {
    Playlists.addHymn(playlist.id, hymn)
    onClose()
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {playlists.map((playlist) => (
        <ListItem
          key={playlist.id}
          onPress={() => playlistSelected(playlist)}
          leadingComp={() => (
            <Image
              source={getVisualAsset(playlist.visualId)}
              width={48}
              height={48}
              style={{
                aspectRatio: 1,
                flex: 1,
                borderRadius: 8,
              }}
            />
          )}
          title={playlist.name}
          subtitle={`${playlist.hymns.length} Himno(s)`}
        />
      ))}
    </BottomSheet>
  )
}
