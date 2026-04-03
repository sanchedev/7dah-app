import { useCurrentTime } from '@/hooks/audio/audio-controllers'
import { useCurrent } from '@/hooks/audio/current'
import { useColors } from '@/hooks/colors'
import { useHymn } from '@/hooks/hymn/hymn'
import { useVisualFromHymnId } from '@/hooks/visuals/visual'
import { goToHymn } from '@/lib/hymns/link'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRef } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { PlayPauseButton } from '../audio/play-button'
import { UiText } from '../ui/text'

export function HymnPlaying() {
  const current = useCurrent()
  const hymn = useHymn(current.hymnId)
  const visual = useVisualFromHymnId(current.hymnId)

  const targetRef = useRef<View | null>(null)

  const colors = useColors()

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 82 * (current.hymnId == null ? -1 : 1),
        height: 82,
        left: 16,
        right: 16,
        zIndex: 5,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
      <BlurTargetView
        ref={targetRef}
        style={{
          flex: 1,
          flexWrap: 'wrap',
          ...StyleSheet.absoluteFill,
        }}>
        <Image
          source={{ uri: visual?.url }}
          style={{ flex: 1 }}
          width={1024}
          height={1024}
        />
      </BlurTargetView>
      <BlurView
        blurTarget={targetRef}
        intensity={100}
        tint={colors.theme}
        style={{
          flex: 1,
        }}
        blurMethod='dimezisBlurView'>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              if (hymn == null) return
              goToHymn(hymn.id, current.playlist?.id)
            }}>
            {({ pressed }) => (
              <Animated.View
                style={[
                  {
                    flexDirection: 'row',
                    height: 80,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingVertical: 8,
                    gap: 16,
                    transition: 'all 100ms',
                  },
                  pressed && {
                    backgroundColor: colors.hoverBackground,
                    borderRadius: 8,
                  },
                ]}>
                <Image
                  source={{ uri: visual?.url }}
                  style={{ width: 64, height: 64 }}
                  width={64}
                  height={64}
                  borderRadius={4}
                />
                <View
                  style={{
                    flexDirection: 'column',
                    gap: 4,
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <UiText style={{ fontSize: 16 }} numberOfLines={1}>
                    {hymn?.title}
                  </UiText>
                  <UiText
                    style={{ opacity: 0.5, fontSize: 12 }}
                    numberOfLines={2}>
                    Himno #{hymn == null ? '---' : hymn.id.toUpperCase()}
                    {current.playlist?.name
                      ? ` - ${current.playlist.name}`
                      : ''}
                  </UiText>
                </View>
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <PlayBtn />
                </View>
              </Animated.View>
            )}
          </Pressable>
          <CurrentTimeSlider />
        </View>
      </BlurView>
    </View>
  )
}

function PlayBtn() {
  return <PlayPauseButton />
}

function CurrentTimeSlider() {
  const current = useCurrent()
  const hymn = useHymn(current.hymnId)
  const colors = useColors()
  const currentTime = useCurrentTime() * 1000

  return (
    <View style={{ height: 2, width: '100%', flexDirection: 'row' }}>
      <View
        style={{
          flex: currentTime,
          backgroundColor: colors.primaryBackground,
          borderRadius: 2,
        }}
      />
      <View
        style={{
          flex: (hymn?.duration ?? 10 ** 4) - currentTime,
          backgroundColor: colors.secondaryBackground,
          opacity: 0.25,
        }}
      />
    </View>
  )
}
