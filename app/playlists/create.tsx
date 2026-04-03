import VisualBackground from '@/components/hymn/hymn-background'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { UiText } from '@/components/ui/text'
import { useColors } from '@/hooks/colors'
import { useVisual } from '@/hooks/visuals/visual'
import { Playlists } from '@/lib/audio/playlists'
import { Visuals } from '@/lib/visuals/visuals'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  ScaledSize,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const getSize = ({ window }: { window?: ScaledSize } = {}) => {
  const dimensions = window ?? Dimensions.get('window')
  return Math.min(dimensions.height, dimensions.width)
}

const visuals = Visuals.getAllIds()
export default function CreatePlaylistScreen() {
  const colors = useColors()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [visualIndex, setVisualIndex] = useState(0)
  const visual = useVisual(visuals[visualIndex])!

  const targetRef = useRef<View | null>(null)

  const [name, setName] = useState('')

  const handleCreate = () => {
    Playlists.add({
      name,
      visualId: visual.id,
      hymns: [],
    })
    router.back()
  }

  return (
    <VisualBackground visualId={visual.id}>
      <BlurTargetView
        ref={targetRef}
        style={{
          flex: 1,
          flexWrap: 'wrap',
          ...StyleSheet.absoluteFill,
        }}>
        <Image source={{ uri: visual.url }} width={1024} height={1024} />
      </BlurTargetView>
      <BlurView
        blurTarget={targetRef}
        intensity={100}
        tint={colors.theme}
        style={{
          flex: 1,
        }}
        blurMethod='dimezisBlurView'>
        <ScrollView
          style={{
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingTop: insets.top + 8,
              height: 56 + insets.top,
              paddingBottom: 8,
              gap: 16,
            }}>
            <IconButton iconName='arrow-back' onPress={() => router.back()} />
            <UiText
              variant='title'
              numberOfLines={1}
              style={{ paddingRight: 8, flex: 1 }}>
              Crear Playlist
            </UiText>
          </View>
          <View
            style={{
              marginVertical: 16,
              flex: 1,
            }}>
            <ScrollView
              horizontal
              contentContainerStyle={[
                {
                  paddingLeft: 8,
                  paddingRight: 8,
                  gap: 8,
                },
              ]}
              showsHorizontalScrollIndicator={false}
              snapToAlignment='center'
              pagingEnabled
              decelerationRate='fast'>
              {visuals.map((visualId, index) => {
                return (
                  <VisualSelector
                    key={visualId}
                    visualId={visualId}
                    index={index}
                    onSelect={() => setVisualIndex(index)}
                    selected={index === visualIndex}
                  />
                )
              })}
            </ScrollView>
          </View>
          <View
            style={{
              marginVertical: 4,
              width: '100%',
              flexDirection: 'row',
              gap: 16,
            }}>
            <TextInput
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
                height: 48,
                fontSize: 16,
                marginVertical: 4,
                flex: 1,
                color: colors.cardForeground,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: colors.cardForeground + '22',
              }}
              placeholderTextColor={colors.cardForeground + 88}
              value={name}
              onChangeText={setName}
              placeholder='Título de la Playlist'></TextInput>
          </View>
          <View style={{ flex: 1, marginTop: 16 }}>
            <Button
              disabled={name.length < 4}
              onPress={handleCreate}
              color='primaryBackground'>
              <UiText
                color='primaryForeground'
                style={{ textAlign: 'center', fontSize: 18 }}>
                Crear
              </UiText>
            </Button>
          </View>
        </ScrollView>
      </BlurView>
    </VisualBackground>
  )
}

interface VisualSelectorProps {
  visualId: string
  index: number
  onSelect: () => void
  selected: boolean
}

function VisualSelector({
  visualId,
  index,
  onSelect,
  selected,
}: VisualSelectorProps) {
  const colors = useColors()
  const visual = useVisual(visualId)

  const insets = useSafeAreaInsets()

  const [cardSize, setCardSize] = useState(getSize())

  const size = Math.min(384, cardSize - 32 + insets.left + insets.right) * 0.75

  useEffect(() => {
    const onResize = (dimensions: { window: ScaledSize }) => {
      setCardSize(getSize(dimensions))
    }
    Dimensions.addEventListener('change', onResize)
  }, [])

  return (
    <Pressable
      key={visualId}
      style={({ pressed }) => [
        {
          padding: 8,
        },
        pressed && {
          backgroundColor: colors.hoverBackground,
          borderRadius: 24,
        },
        selected && {
          backgroundColor: colors.secondaryForeground,
          borderRadius: 24,
        },
      ]}
      onPress={() => onSelect()}>
      <Image
        source={{ uri: visual?.url }}
        style={{
          width: size,
          height: size,
        }}
        width={size}
        height={size}
        borderRadius={16}
      />
    </Pressable>
  )
}
