import { Hymn } from '@/lib/types'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import { ItemSeparator } from '../ui/list-item'
import { HymnItem } from './hymn-item'

export interface HymnListProps extends Omit<
  AnimatedProps<FlashListProps<Hymn>>,
  'data' | 'renderItem'
> {
  hymns: Hymn[]
  action?: ({ hymn }: { hymn: Hymn }) => React.ReactNode
}

export function HymnList({ hymns, action, ...props }: HymnListProps) {
  return (
    <FlashList<Hymn>
      {...(props as any)}
      data={hymns}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={({ number, title }) => `${number}-"${title}"`}
      renderItem={({ item }) => <HymnItem hymn={item} action={action} />}
    />
  )
}

export function AnimatedHymnList({ hymns, action, ...props }: HymnListProps) {
  return (
    <Animated.FlatList
      {...(props as any)}
      data={hymns}
      ItemSeparatorComponent={ItemSeparator}
      keyExtractor={({ number, title }) => `${number}-"${title}"`}
      renderItem={({ item }) => <HymnItem hymn={item} action={action} />}
    />
  )
}
