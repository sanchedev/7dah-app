import { Hymn } from '@/lib/hymns/types'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { ItemSeparator } from '../ui/list-item'
import { HymnItem } from './hymn-item'
import { HymnAction } from './types'

export interface HymnListProps extends Omit<
  AnimatedProps<FlashListProps<Hymn>>,
  'data' | 'renderItem'
> {
  hymnsIds: string[]
  action?: HymnAction
}

export function HymnList({ hymnsIds, action, ...props }: HymnListProps) {
  return (
    <FlashList<string>
      {...(props as any)}
      data={hymnsIds}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(id) => id}
      renderItem={({ item }) => (
        <HymnItem hymnId={item} trailingComp={action} />
      )}
    />
  )
}

export function AnimatedHymnList({
  hymnsIds,
  action,
  ...props
}: HymnListProps) {
  return (
    <Animated.FlatList<string>
      {...(props as any)}
      data={hymnsIds}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={(id) => id}
      renderItem={({ item }) => (
        <HymnItem hymnId={item} trailingComp={action} />
      )}
    />
  )
}
