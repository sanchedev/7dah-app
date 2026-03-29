import { useColors } from '@/hooks/colors'
import { Hymn } from '@/lib/types'
import { getVisualAsset, getVisualFromHymn } from '@/lib/visuals'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  ScaledSize,
  ScrollView,
  ScrollViewProps,
  View,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { UiText } from '../ui/text'

interface HymnCardProps extends ScrollViewProps {
  hymns: Hymn[]
  action?: ({ hymn }: { hymn: Hymn }) => React.ReactNode
}

const getSize = ({ window }: { window?: ScaledSize } = {}) => {
  const dimensions = window ?? Dimensions.get('window')
  return Math.min(dimensions.height, dimensions.width)
}

export function HymnCarousel({
  hymns,
  action,
  contentContainerStyle,
  ...props
}: HymnCardProps) {
  const [cardSize, setCardSize] = useState(getSize())

  const { left, right } = useSafeAreaInsets()

  const cardPadd = cardSize - 32 - cardSize / 4

  useEffect(() => {
    const onResize = (dimensions: { window: ScaledSize }) => {
      setCardSize(getSize(dimensions))
    }
    Dimensions.addEventListener('change', onResize)
  }, [])

  return (
    <ScrollView
      horizontal
      contentContainerStyle={[
        {
          paddingLeft: left + 8,
          paddingRight: right + 8,
          gap: 8,
        },
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={false}
      snapToAlignment='center'
      pagingEnabled
      decelerationRate='fast'
      {...props}>
      {hymns.map((hymn, index) => (
        <HymnCard
          key={`Hymn-card-${hymn.number}-${index}`}
          hymn={hymn}
          size={cardPadd}
          action={action}
        />
      ))}
    </ScrollView>
  )
}

function HymnCard({
  hymn,
  size,
  action: Action,
}: {
  hymn: Hymn
  size: number
  action?: ({ hymn }: { hymn: Hymn }) => React.ReactNode
}) {
  const visual = getVisualFromHymn(hymn.number)!
  const visualAsset = getVisualAsset(visual.id)!

  const colors = useColors()
  const router = useRouter()

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: '/hymns/[hymn]',
          params: { hymn: hymn.number.toString().padStart(3, '0') },
        })
      }>
      {({ pressed }) => (
        <Animated.View
          style={[
            {
              flexDirection: 'column',
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
            source={visualAsset}
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
              <UiText variant='h3'>{hymn.title}</UiText>
              <UiText style={{ opacity: 0.5, fontSize: 14 }}>
                Himno #{hymn.number.toString().padStart(3, '0')}
              </UiText>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {Action && <Action hymn={hymn} />}
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  )
}
