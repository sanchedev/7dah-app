import { useColors } from '@/hooks/colors'
import { Hymn } from '@/lib/types'
import { FlashListProps } from '@shopify/flash-list'
import { View } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { HymnItem } from './hymn-item'

export interface HymnListProps extends Omit<
  AnimatedProps<FlashListProps<Hymn>>,
  'data' | 'renderItem'
> {
  hymns: Hymn[]
}

export function HymnList({ hymns, ...props }: HymnListProps) {
  const colors = useColors()

  return (
    <Animated.FlatList
      {...(props as any)}
      data={hymns}
      ItemSeparatorComponent={() => (
        <View
          style={{
            backgroundColor: colors.text,
            opacity: 0.1,
            width: '100%',
            height: 1,
            marginHorizontal: 8,
          }}
        />
      )}
      keyExtractor={({ number, title }) => `${number}-"${title}"`}
      renderItem={({ item }) => <HymnItem hymn={item} />}
    />
  )
}
