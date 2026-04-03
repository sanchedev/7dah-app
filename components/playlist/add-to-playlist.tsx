import { usePlaylists } from '@/hooks/audio/playlists'
import { useVisual } from '@/hooks/visuals/visual'
import { Playlists } from '@/lib/audio/playlists'
import { Playlist } from '@/lib/audio/types'
import { Hymn } from '@/lib/hymns/types'
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
  const playlists = usePlaylists().filter((p) => !p.hymns.includes(hymn.id))

  const playlistSelected = (playlist: Playlist) => {
    Playlists.addHymn(playlist.id, hymn.id)
    onClose()
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          hymnId={hymn.id}
          playlist={playlist}
          onSelected={() => playlistSelected(playlist)}
        />
      ))}
    </BottomSheet>
  )
}

interface PlaylistItemProps {
  hymnId: string
  playlist: Playlist
  onSelected?: () => void
}
export function PlaylistItem({
  hymnId,
  playlist,
  onSelected,
}: PlaylistItemProps) {
  const visual = useVisual(playlist.visualId)

  const playlistSelected = () => {
    Playlists.addHymn(playlist.id, hymnId)
    onSelected?.()
  }

  return (
    <ListItem
      key={playlist.id}
      onPress={() => playlistSelected()}
      leadingComp={() => (
        <Image
          source={{ uri: visual?.url }}
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
  )
}
