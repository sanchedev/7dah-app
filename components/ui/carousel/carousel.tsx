import { FlashList, FlashListProps } from '@shopify/flash-list'

export interface CarouselProps<T extends object> extends Omit<
  FlashListProps<Card<T>>,
  'data' | 'renderItem' | 'keyExtractor'
> {
  data: Card<T>[]
  cardComponent: (props: T) => React.ReactNode
}

export interface Card<T extends object> {
  id: string
  props: T
}

export function Carousel<T extends object>({
  data,
  cardComponent: Card,
  contentContainerStyle,
  ...props
}: CarouselProps<T>) {
  return (
    <FlashList<Card<T>>
      horizontal
      contentContainerStyle={[
        {
          gap: 8,
        },
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={false}
      snapToAlignment='center'
      pagingEnabled
      decelerationRate='fast'
      data={data}
      keyExtractor={({ id }) => id}
      renderItem={({ item: { props } }) => <Card {...props} />}
      {...props}
    />
  )
}
