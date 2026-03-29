import { useColors } from '@/hooks/colors'
import { Hymn } from '@/lib/types'
import { getVisualAsset, getVisualFromHymn } from '@/lib/visuals'
import { useRouter } from 'expo-router'
import { Image, Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { UiText } from '../ui/text'

interface HymnItemProps {
  hymn: Hymn
  playlistId?: string
  action?: ({ hymn }: { hymn: Hymn }) => React.ReactNode
  onPrevPress?: () => void
}

const ITEM_HEIGHT = 64

export function HymnItem({
  hymn,
  playlistId,
  action: Action,
  onPrevPress,
}: HymnItemProps) {
  const visual = getVisualFromHymn(hymn.number)!
  const visualAsset = getVisualAsset(visual.id)!

  const { left, right } = useSafeAreaInsets()

  const colors = useColors()
  const router = useRouter()

  return (
    <Pressable
      onPress={() => {
        onPrevPress?.()
        router.navigate({
          pathname: '/hymns/[hymn]?playlistId=[playlistId]',
          params: {
            hymn: hymn.number.toString().padStart(3, '0'),
            playlistId,
          },
        })
      }}>
      {({ pressed }) => (
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              height: ITEM_HEIGHT + 16,
              marginLeft: 8 + left,
              marginRight: 8 + right,
              paddingLeft: 8,
              paddingRight: 8,
              paddingVertical: 8,
              gap: 16,
              transition: 'all 100ms',
            },
            pressed && {
              backgroundColor: colors.hoverBackground,
              borderRadius: 8,
            },
          ]}>
          <Image
            source={visualAsset}
            style={{ width: ITEM_HEIGHT, height: ITEM_HEIGHT }}
            width={ITEM_HEIGHT}
            height={ITEM_HEIGHT}
            borderRadius={4}
          />
          <View
            style={{
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'center',
              flex: 1,
            }}>
            <UiText style={{ fontSize: 16 }} numberOfLines={1}>
              {hymn.title}
            </UiText>
            <UiText style={{ opacity: 0.5, fontSize: 12 }}>
              Himno #{hymn.number.toString().padStart(3, '0')}
            </UiText>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {Action && <Action hymn={hymn} />}
          </View>
        </Animated.View>
      )}
    </Pressable>
  )
}
