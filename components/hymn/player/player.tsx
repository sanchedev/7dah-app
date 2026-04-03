import { usePlaylist } from '@/hooks/audio/playlist'
import { useColors } from '@/hooks/colors'
import { useVisualFromHymnId } from '@/hooks/visuals/visual'
import { Current } from '@/lib/audio/current'
import { goToHymn } from '@/lib/hymns/link'
import { Hymn } from '@/lib/hymns/types'
import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import VisualBackground from '../hymn-background'
import { ControlsPlayer } from './controls-player'
import { HeaderPlayer } from './header-player'
import { LyricsPlayer } from './lyrics-player'
import { OptionsPlayer } from './options-player'
import { TopBarPlayer } from './top-bar-player'

interface HymnPlayerProps {
  hymn: Hymn
  playlistId?: string
}

export default function HymnPlayer({ hymn, playlistId }: HymnPlayerProps) {
  const visual = useVisualFromHymnId(hymn.id)!

  const insets = useSafeAreaInsets()

  const colors = useColors()

  const lastIndex = useRef(Current.getIndex())

  useEffect(() => {
    const handleIndexChange = (index: number) => {
      const currentHymnId = Current.getHymnId()

      if (currentHymnId != null) {
        if (
          !Current.isCurrent({
            index: Current.indexOf(hymn.id, playlistId ?? null),
            playlistId: playlistId ?? null,
          })
        ) {
          goToHymn(currentHymnId, playlistId, { replace: true })
        }
      }

      lastIndex.current = index
    }

    Current.indexChanged.on(handleIndexChange)

    return () => {
      Current.indexChanged.off(handleIndexChange)
    }
  }, [hymn, playlistId])

  const playlist = usePlaylist(playlistId ?? null)

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
      [0, 56 + insets.top],
      [0, 1],
      Extrapolation.CLAMP,
    )

    return {
      opacity: intensity,
    }
  })

  return (
    <VisualBackground visualId={visual.id}>
      <Animated.ScrollView
        onScroll={handler}
        style={{
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        }}>
        <View style={{ height: insets.top + 56 }} />
        <HeaderPlayer hymn={hymn} />
        <ControlsPlayer hymn={hymn} playlist={playlist} />
        <OptionsPlayer hymn={hymn} />
        <LyricsPlayer hymn={hymn} playlistId={playlist?.id ?? null} />
        <View style={{ height: insets.bottom + 16 }} />
      </Animated.ScrollView>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: insets.top + 56,
            zIndex: 10,
          },
        ]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            blurStyle,
            { backgroundColor: colors.background + 'aa' },
          ]}></Animated.View>
        <View
          style={{
            width: '100%',
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          }}>
          <TopBarPlayer hymn={hymn} playlist={playlist} />
        </View>
      </Animated.View>
    </VisualBackground>
  )
}
