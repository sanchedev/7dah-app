import { useBottomSheet } from '@/hooks/bottom-sheet'
import { Playlists } from '@/lib/audio/playlists'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { HymnItem } from '../hymn/hymn-item'
import { Icon } from '../ui/icon'
import { ListItem } from '../ui/list-item'

const ITEM_HEIGHT = 64

function clampIndex(index: number, max: number) {
  'worklet'
  return Math.max(0, Math.min(index, max - 1))
}

export function DraggablePlaylist({
  index,
  hymnId,
  playlistId,
  onDrop,
  action,
  move,
  total,
}: {
  index: number
  hymnId: string
  onDrop: (from: number, to: number) => void
  action?: () => React.ReactNode
  move: (from: number, to: number) => void
  playlistId: string
  total: number
}) {
  const translateY = useSharedValue(0)

  const startIndex = useSharedValue(index)
  const targetIndex = useSharedValue(index)

  const gesture = Gesture.Pan()
    .onStart(() => {
      startIndex.value = index
      targetIndex.value = index
    })
    .onUpdate((e) => {
      const maxTranslate = (total - 1 - startIndex.value) * ITEM_HEIGHT
      const minTranslate = -startIndex.value * ITEM_HEIGHT

      let nextTranslate = e.translationY

      if (nextTranslate > maxTranslate) nextTranslate = maxTranslate
      if (nextTranslate < minTranslate) nextTranslate = minTranslate

      translateY.value = nextTranslate

      let newIndex = Math.floor(
        (startIndex.value * ITEM_HEIGHT + nextTranslate) / ITEM_HEIGHT,
      )

      const clamped = clampIndex(newIndex, total)

      if (clamped !== targetIndex.value) {
        const from = targetIndex.value
        targetIndex.value = clamped

        scheduleOnRN(move, from, clamped)
      }
    })
    .onEnd(() => {
      const from = startIndex.value
      const to = targetIndex.value

      translateY.value = withSpring(0)

      scheduleOnRN(onDrop, from, to)
    })

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: 10,
  }))

  const modal = useBottomSheet()

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style}>
        <HymnItem
          hymnId={hymnId}
          trailingComp={action}
          playlistId={playlistId}
          onLongPress={() => {
            modal.openSheet([
              {
                id: 'delete',
                comp: ListItem,
                props: {
                  title: 'Eliminar',
                  leadingComp: () => <Icon name='delete' />,
                  onPress: () => {
                    Playlists.removeHymn(playlistId, hymnId)
                    modal.closeSheet()
                  },
                },
              },
            ])
          }}
        />
      </Animated.View>
    </GestureDetector>
  )
}
