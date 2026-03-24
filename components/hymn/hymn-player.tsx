import {
  useAudioCurrent,
  useAudioFavorites,
  useAudioLoop,
  useAudioPlaying,
  useAudioProgress,
  useAudioQueue,
  useAudioShuffle,
} from '@/hooks/audio-hooks'
import { useColors } from '@/hooks/colors'
import { AudioManager } from '@/lib/audio/audio-manager'
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
import { IconButton } from '../ui/icon-button'
import { AnimatedUiText, UiText } from '../ui/text'

interface HymnPageProps {
  hymn: Hymn
}

const getSize = ({ window }: { window?: ScaledSize } = {}) => {
  const dimensions = window ?? Dimensions.get('window')
  return Math.min(dimensions.height, dimensions.width)
}

export default function HymnPlayer({ hymn }: HymnPageProps) {
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

  useEffect(() => {
    const handleIndexChange = (index: number) => {
      if (index < 0) return

      router.navigate({
        pathname: '/hymns/[hymn]',
        params: {
          hymn: AudioManager.getQueue()
            [index]!.number.toString()
            .padStart(3, '0'),
        },
      })
    }
    AudioManager.addEventListener('indexChange', handleIndexChange)

    return () => {
      AudioManager.removeEventListener('indexChange', handleIndexChange)
    }
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
                Himno #{hymn.number.toString().padStart(3, '0')}
              </UiText>
            </View>

            <View>
              <FavoriteBtn hymn={hymn} />
            </View>
          </View>
          <CurrentProgressBar hymn={hymn} />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              marginBottom: 32,
            }}>
            <LoopBtn />
            <SkipPrevBtn hymn={hymn} />
            <PlayPauseBtn hymn={hymn} />
            <SkipNextBtn hymn={hymn} />
            <ShuffleBtn />
          </View>
          <LyricsViewer hymn={hymn} />
          <View style={{ height: insets.bottom + 16 }} />
        </ScrollView>
      </BlurView>
    </View>
  )
}

interface HymnAsProp {
  hymn: Hymn
}

function CurrentProgressBar({ hymn }: HymnAsProp) {
  const progress = useAudioProgress()
  const colors = useColors()
  const current = useAudioCurrent()
  const duration = AudioManager.getAudioInfo(hymn.number)?.duration ?? 0

  return (
    <>
      <Slider
        style={{
          marginBottom: 16,
          marginTop: 24,
        }}
        thumbTintColor={colors.text}
        minimumTrackTintColor={colors.text}
        maximumTrackTintColor={colors.text + '88'}
        minimumValue={0}
        value={progress}
        onValueChange={AudioManager.seek}
        step={0.125}
        maximumValue={duration}
        disabled={current.hymn?.number !== hymn.number}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <UiText>
          {formatTime(current.hymn?.number !== hymn.number ? 0 : progress)}
        </UiText>
        <UiText>{formatTime(duration)}</UiText>
      </View>
    </>
  )
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mins}:${secs}`
}

function PlayPauseBtn({ hymn }: HymnAsProp) {
  const playing = useAudioPlaying()
  const current = useAudioCurrent()

  const handlePress = () => {
    if (AudioManager.findHymn(hymn) < 0) {
      AudioManager.unloadPlaylist()
    }

    if (!playing) {
      if (current.hymn?.number !== hymn.number) {
        const index = AudioManager.findHymn(hymn)
        AudioManager.skip(index, true)
      } else {
        AudioManager.play()
      }
    } else {
      AudioManager.pause()
    }
  }

  return (
    <IconButton
      iconName={!playing || current.hymn !== hymn ? 'play-arrow' : 'pause'}
      iconSize='xl'
      filled
      onPress={handlePress}
    />
  )
}

function SkipPrevBtn({ hymn }: HymnAsProp) {
  const queue = useAudioQueue()

  const handlePress = () => {
    const index = AudioManager.findHymn(hymn)
    if (index < 1) return

    AudioManager.skip(index - 1, true)
  }

  return (
    <IconButton
      iconName='skip-previous'
      iconSize='lg'
      onPress={handlePress}
      disabled={queue.length === 0 || AudioManager.findHymn(hymn) <= 0}
    />
  )
}

function SkipNextBtn({ hymn }: HymnAsProp) {
  const queue = useAudioQueue()

  const handlePress = () => {
    const index = AudioManager.findHymn(hymn)
    if (index >= queue.length - 1) return

    AudioManager.skip(index + 1, true)
  }

  return (
    <IconButton
      iconName='skip-next'
      iconSize='lg'
      onPress={handlePress}
      disabled={
        queue.length === 0 || AudioManager.findHymn(hymn) >= queue.length - 1
      }
    />
  )
}

function LoopBtn() {
  const loop = useAudioLoop()

  const handlePress = () => {
    AudioManager.setLoop(!loop)
    if (!loop) {
      AudioManager.setShuffle(false)
    }
  }

  return (
    <IconButton
      iconName='loop'
      iconSize='md'
      filled={loop}
      onPress={handlePress}
    />
  )
}

function ShuffleBtn() {
  const shuffle = useAudioShuffle()

  const handlePress = () => {
    AudioManager.setShuffle(!shuffle)
    if (!shuffle) {
      AudioManager.setLoop(false)
    }
  }

  return (
    <IconButton
      iconName='shuffle'
      iconSize='md'
      filled={shuffle}
      onPress={handlePress}
    />
  )
}

function FavoriteBtn({ hymn }: HymnAsProp) {
  const favorites = useAudioFavorites()

  const handlePress = () => {
    AudioManager.toggleFavorite(hymn.number)
  }

  return (
    <IconButton
      iconName={favorites.has(hymn.number) ? 'favorite' : 'favorite-border'}
      onPress={handlePress}
    />
  )
}

function LyricsViewer({ hymn }: HymnAsProp) {
  const colors = useColors()
  const progress = useAudioProgress() * 1000

  return (
    <View
      style={{
        backgroundColor: colors.hoverBg,
        padding: 16,
        borderRadius: 16,
        gap: 8,
      }}>
      {hymn.lyrics.slice(1, -1).map((lyric, i) => {
        const light =
          lyric.timestamp <= progress + 300 &&
          (hymn.lyrics[i + 2] == null ||
            hymn.lyrics[i + 2].timestamp >= progress - 300)
        return (
          <AnimatedUiText
            key={lyric.kind + i}
            variant='special'
            style={{
              paddingVertical: light ? 0 : 2,
              fontSize: light ? 20 : 18,
              fontFamily: light ? 'RosarioBold' : 'Rosario',
              marginBottom: hymn.lyrics[i + 2]?.index !== lyric.index ? 12 : 0,
              transitionDuration: '100ms',
              transitionProperty: 'all',
            }}>
            {lyric.line}
          </AnimatedUiText>
        )
      })}
    </View>
  )
}
