import { AnimatedHymnList } from '@/components/hymn/hymn-list'
import { IconButton } from '@/components/ui/icon-button'
import { UiText } from '@/components/ui/text'
import { useAudioFavorites } from '@/hooks/audio-hooks'
import { useColors } from '@/hooks/colors'
import { AudioManager } from '@/lib/audio/audio-manager'
import { hymns } from '@/lib/hymns'
import { Hymn } from '@/lib/types'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const NAV_HEIGHT = 72

export default function FavoritesScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const favorites = useAudioFavorites()
  const navHeight = NAV_HEIGHT + insets.top

  const scrollY = useSharedValue(0)

  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y
      scrollY.value = y
    },
  })

  const blurStyle = useAnimatedStyle(() => {
    const intensity = interpolate(
      scrollY.value,
      [0, navHeight],
      [0, 1],
      Extrapolation.CLAMP,
    )

    return {
      // hack: blur se pasa como prop, pero usamos estilo para sincronizar
      opacity: intensity,
    }
  })

  const targetRef = useRef<View | null>(null)

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <BlurTargetView ref={targetRef}>
        <AnimatedHymnList
          hymns={[...favorites].map((f) => hymns[f - 1])}
          contentContainerStyle={{
            paddingTop: navHeight + 16,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }}
          action={FavoriteBtn}
        />
      </BlurTargetView>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: navHeight,
            paddingTop: insets.top,
            justifyContent: 'center',
            paddingHorizontal: 16,
          },
        ]}>
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFill,
              borderBottomWidth: 1,
              borderBottomColor: colors.text + '44',
            },
            blurStyle,
          ]}>
          <BlurView
            blurTarget={targetRef}
            intensity={100}
            tint={colors.theme}
            blurMethod='dimezisBlurView'
            style={{ flex: 1 }}
          />
        </Animated.View>
        <View
          style={[
            {
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <UiText style={{ fontSize: 18, fontFamily: 'RosarioBold' }}>
            Favoritos
          </UiText>
        </View>
      </Animated.View>
    </View>
  )
}

function FavoriteBtn({ hymn }: { hymn: Hymn }) {
  const handlePress = () => {
    AudioManager.toggleFavorite(hymn.number)
  }

  return <IconButton iconName={'heart-broken'} onPress={handlePress} />
}
