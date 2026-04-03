import { useVisual } from '@/hooks/visuals/visual'
import { Playlist } from '@/lib/audio/types'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { ListItem, ListItemProps } from '../ui/list-item'

interface PlaylistItemProps extends Omit<
  ListItemProps,
  'leadingComp' | 'title' | 'subtitle'
> {
  playlist: Playlist
}

export function PlaylistItem({
  playlist,
  trailingComp,
  ...props
}: PlaylistItemProps) {
  const visual = useVisual(playlist.visualId)

  const router = useRouter()

  return (
    <ListItem
      leadingComp={() => (
        <Image
          source={{ uri: visual?.url }}
          style={{ flex: 1, aspectRatio: 1, borderRadius: 4 }}
        />
      )}
      title={playlist.name}
      subtitle={`${playlist.hymns.length} Himno(s)`}
      trailingComp={trailingComp}
      onPress={() =>
        router.navigate({
          pathname: '/playlists/[playlistId]',
          params: { playlistId: playlist.id },
        })
      }
      {...props}
    />
  )
}
