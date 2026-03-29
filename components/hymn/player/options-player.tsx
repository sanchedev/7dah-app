import { IconButton } from '@/components/ui/icon-button'
import { usePlaylists } from '@/hooks/audio/playlists'
import { Hymn } from '@/lib/types'
import { Share, View } from 'react-native'

interface OptionsPlayerProps {
  hymn: Hymn
  onCloseAddToPlaylist: () => void
}

export function OptionsPlayer({
  hymn,
  onCloseAddToPlaylist,
}: OptionsPlayerProps) {
  const playlists = usePlaylists()

  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'space-between',
      }}>
      <IconButton
        iconName='playlist-add'
        iconSize='md'
        onPress={onCloseAddToPlaylist}
        disabled={playlists.every((p) =>
          p.hymns.some((h) => h.number === hymn.number),
        )}
      />
      <IconButton
        iconName='share'
        iconSize='md'
        onPress={() =>
          Share.share(
            {
              message: `https://7dah.vercel.app/hymn-${hymn.number.toString().padStart(3, '0')}`,
              title: `Himno #${hymn.number.toString().padStart(3, '0')} - ${hymn.title}`,
              url: `https://7dah.vercel.app/hymn-${hymn.number.toString().padStart(3, '0')}`,
            },
            {
              dialogTitle: 'Enviar un Himno',
            },
          )
        }
      />
    </View>
  )
}
