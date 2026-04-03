import { useColors } from '@/hooks/colors'
import { useHymn } from '@/hooks/hymn/hymn'
import { useVisualFromHymnId } from '@/hooks/visuals/visual'
import { goToHymn } from '@/lib/hymns/link'
import { FlashList, FlashListProps } from '@shopify/flash-list'
import { useEffect, useState } from 'react'
import { Dimensions, Image, Pressable, ScaledSize, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { UiText } from '../ui/text'
import { HymnAction } from './types'

interface HymnCardProps extends Omit<
  FlashListProps<{ hymnId: string; playlistId?: string }>,
  'data' | 'renderItem' | 'horizontal'
> {
  data: { hymnId: string; playlistId?: string }[]
  action?: HymnAction
}

const getSize = ({ window }: { window?: ScaledSize } = {}) => {
  const dimensions = window ?? Dimensions.get('window')
  return Math.min(dimensions.height, dimensions.width)
}

export function HymnCarousel({
  data,
  action,
  contentContainerStyle,
  ...props
}: HymnCardProps) {
  const [cardSize, setCardSize] = useState(getSize())

  const cardPadd = Math.min(cardSize - 32 - cardSize / 4, 192)

  useEffect(() => {
    const onResize = (dimensions: { window: ScaledSize }) => {
      setCardSize(getSize(dimensions))
    }
    Dimensions.addEventListener('change', onResize)
  }, [])

  return (
    <FlashList
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
      keyExtractor={({ hymnId: h, playlistId: p }) => `card-${p}:${h}`}
      renderItem={({ item: { hymnId, playlistId } }) => (
        <HymnCard
          hymnId={hymnId}
          playlistId={playlistId}
          size={cardPadd}
          action={action}
        />
      )}
      {...props}></FlashList>
  )
}

function HymnCard({
  hymnId,
  playlistId,
  size,
  action: Action,
}: {
  hymnId: string
  playlistId?: string
  size: number
  action?: HymnAction
}) {
  const hymn = useHymn(hymnId)
  const visual = useVisualFromHymnId(hymnId)!

  const colors = useColors()

  return (
    <Pressable onPress={() => goToHymn(hymnId, playlistId)}>
      {({ pressed }) => (
        <Animated.View
          style={[
            {
              flexDirection: 'column',
              width: size + 16,
              overflow: 'hidden',
              padding: 8,
              gap: 8,
              transition: 'all 100ms',
            },
            pressed && {
              backgroundColor: colors.hoverBackground,
              borderRadius: 16,
            },
          ]}>
          <Image
            source={{ uri: visual.url }}
            style={{ width: size, height: size }}
            width={size}
            height={size}
            borderRadius={16}
          />
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                gap: 4,
                justifyContent: 'center',
                flex: 1,
              }}>
              <UiText variant='h3' numberOfLines={1}>
                {hymn?.title}
              </UiText>
              <UiText style={{ opacity: 0.5, fontSize: 14 }}>
                Himno #{hymn?.id.toUpperCase()}
              </UiText>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {hymn && Action && <Action hymn={hymn} playlistId={playlistId} />}
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  )
}
