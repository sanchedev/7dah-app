import { useColors } from '@/hooks/colors'
import { Hymn } from '@/lib/types'
import { getVisualAsset, getVisualFromHymn } from '@/lib/visuals'
import Slider from '@react-native-community/slider'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  type ScaledSize,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconButton } from './ui/icon-button'
import { UiText } from './ui/text'

interface HymnPageProps {
  hymn: Hymn
}

const getSize = ({ window }: { window?: ScaledSize } = {}) => {
  const dimensions = window ?? Dimensions.get('window')
  return Math.min(dimensions.height, dimensions.width)
}

export default function HymnPage({ hymn }: HymnPageProps) {
  const visual = getVisualFromHymn(hymn.number)!
  const visualAsset = getVisualAsset(visual.id)!

  const targetRef = useRef<View | null>(null)

  const insets = useSafeAreaInsets()
  const router = useRouter()

  const colors = useColors()

  const [cardSize, setCardSize] = useState(getSize())

  const cardPadd = Math.min(384, cardSize - 32 + insets.left + insets.right)

  useEffect(() => {
    const onResize = (dimensions: { window: ScaledSize }) => {
      setCardSize(getSize(dimensions))
    }
    Dimensions.addEventListener('change', onResize)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <BlurTargetView
        ref={targetRef}
        style={{
          flex: 1,
          flexWrap: 'wrap',
          ...StyleSheet.absoluteFill,
        }}>
        <Image source={visualAsset} width={1024} height={1024} />
      </BlurTargetView>
      <BlurView
        blurTarget={targetRef}
        intensity={100}
        tint={colors.theme}
        style={{
          flex: 1,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        }}
        blurMethod='dimezisBlurView'>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingTop: insets.top + 8,
              height: 56 + insets.top,
              paddingBottom: 8,
              justifyContent: 'space-between',
            }}>
            <IconButton iconName='arrow-back' onPress={() => router.back()} />
            <IconButton
              iconName='share'
              onPress={() => console.log('Share!')}
            />
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 16,
            }}>
            <Image
              source={visualAsset}
              style={{ aspectRatio: 1 }}
              width={cardPadd}
              height={cardPadd}
              borderRadius={cardPadd / 16}
            />
          </View>
          <UiText variant='subtitle' style={{ marginVertical: 4 }}>
            {hymn.title}
          </UiText>
          <UiText style={{ opacity: 0.5 }}>
            Himno #{hymn.number.toString().padStart(3, '0')}
          </UiText>
          <Slider
            style={{
              marginBottom: 16,
              marginTop: 24,
            }}
            thumbTintColor={colors.text}
            minimumTrackTintColor={colors.text}
            maximumTrackTintColor={colors.text + '88'}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <UiText>00:00</UiText>
            <UiText>00:00</UiText>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}>
            <IconButton iconName='skip-previous' iconSize='lg' />
            <IconButton iconName='play-arrow' iconSize='xl' filled />
            <IconButton iconName='skip-next' iconSize='lg' />
          </View>
        </ScrollView>
      </BlurView>
    </View>
  )
}
