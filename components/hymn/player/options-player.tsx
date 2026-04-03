import { PlaylistItem } from '@/components/playlist/add-to-playlist'
import { IconButton } from '@/components/ui/icon-button'
import { usePlaylists } from '@/hooks/audio/playlists'
import {
  useBottomSheet,
  useBottomSheetCloseOnNavigate,
} from '@/hooks/bottom-sheet'
import { Hymn } from '@/lib/hymns/types'
import { Share, View } from 'react-native'

interface OptionsPlayerProps {
  hymn: Hymn
}

export function OptionsPlayer({ hymn }: OptionsPlayerProps) {
  const playlists = usePlaylists()
  const modal = useBottomSheet()
  useBottomSheetCloseOnNavigate()

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
        onPress={() =>
          modal.openSheet(
            playlists.map((p) => ({
              id: p.id,
              comp: PlaylistItem,
              props: {
                hymnId: hymn.id,
                playlist: p,
                onSelected: modal.closeSheet,
              },
            })),
          )
        }
        disabled={playlists.every((p) => p.hymns.includes(hymn.id))}
      />
      <IconButton
        iconName='share'
        iconSize='md'
        onPress={() =>
          Share.share(
            {
              message: `https://7dah.vercel.app/hymn-${hymn.number.toString().padStart(3, '0')}`,
              title: `Himno #${hymn.id.toUpperCase()} - ${hymn.title}`,
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
