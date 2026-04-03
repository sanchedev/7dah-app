import { UiText } from '@/components/ui/text'
import { useVisualFromHymnId } from '@/hooks/visuals/visual'
import { Hymn } from '@/lib/hymns/types'
import { useEffect, useState } from 'react'
import { Dimensions, Image, ScaledSize, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface HeaderPlayerProps {
  hymn: Hymn
}
const getSize = ({ window }: { window?: ScaledSize } = {}) => {
  const dimensions = window ?? Dimensions.get('window')
  return Math.min(dimensions.height, dimensions.width)
}

export function HeaderPlayer({ hymn }: HeaderPlayerProps) {
  const visual = useVisualFromHymnId(hymn.id)

  const insets = useSafeAreaInsets()

  const [cardSize, setCardSize] = useState(getSize())

  const cardPadd = Math.min(384, cardSize - 32 + insets.left + insets.right)

  useEffect(() => {
    const onResize = (dimensions: { window: ScaledSize }) => {
      setCardSize(getSize(dimensions))
    }
    Dimensions.addEventListener('change', onResize)
  }, [])
  return (
    <View>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 16,
        }}>
        <Image
          source={{ uri: visual?.url }}
          style={{ aspectRatio: 1 }}
          width={cardPadd}
          height={cardPadd}
          borderRadius={cardPadd / 16}
        />
      </View>
      <View
        style={{
          marginVertical: 4,
          width: '100%',
          flexDirection: 'row',
          gap: 16,
        }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <UiText
            variant='subtitle'
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{
              marginVertical: 4,
            }}>
            {hymn.title}
          </UiText>

          <UiText style={{ opacity: 0.5 }}>
            Himno #{hymn.id.toUpperCase()}
          </UiText>
        </View>
      </View>
    </View>
  )
}
