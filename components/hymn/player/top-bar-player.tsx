import { FavoriteButton } from '@/components/audio/favorite-button'
import { IconButton } from '@/components/ui/icon-button'
import { UiText } from '@/components/ui/text'
import { useColors } from '@/hooks/colors'
import { Playlist } from '@/lib/audio/types'
import { Hymn } from '@/lib/hymns/types'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface TopBarPlayerProps {
  hymn: Hymn
  playlist: Playlist | null
}

export function TopBarPlayer({ hymn, playlist }: TopBarPlayerProps) {
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const router = useRouter()

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        paddingTop: insets.top + 8,
        height: 56 + insets.top,
        paddingBottom: 8,
      }}>
      <IconButton iconName='arrow-back' onPress={() => router.back()} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {playlist?.hymns.includes(hymn.id) && (
          <UiText
            style={{ textAlign: 'center', color: colors.foreground + '88' }}
            variant='h3'>
            {playlist.name}
          </UiText>
        )}
      </View>
      <FavoriteButton hymnId={hymn.id} />
    </View>
  )
}
