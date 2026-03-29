import { useCurrentTime } from '@/hooks/audio/audio-controllers'
import { useCurrent } from '@/hooks/audio/current'
import { useColors } from '@/hooks/colors'
import { useGoToHymn } from '@/hooks/goto-hymn'
import { getVisualAsset, getVisualFromHymn } from '@/lib/visuals'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRef } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { PlayPauseButton } from '../audio/play-button'
import { UiText } from '../ui/text'

export function HymnPlaying() {
  const current = useCurrent()

  const targetRef = useRef<View | null>(null)

  const visual =
    current.hymn == null ? null : getVisualFromHymn(current.hymn.number)
  const visualAsset = visual && getVisualAsset(visual.id)

  const colors = useColors()

  const go = useGoToHymn()

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 82 * (current.hymn == null ? -1 : 1),
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
          source={visualAsset ?? undefined}
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
              go(current.hymn?.number ?? -1, current.playlist?.id ?? null)
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
                  source={visualAsset ?? undefined}
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
                    {current.hymn?.title}
                  </UiText>
                  <UiText
                    style={{ opacity: 0.5, fontSize: 12 }}
                    numberOfLines={2}>
                    Himno #
                    {current.hymn == null
                      ? '---'
                      : current.hymn.number.toString().padStart(3, '0')}
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
          flex: (current.hymn?.duration ?? 10 ** 4) - currentTime,
          backgroundColor: colors.secondaryBackground,
          opacity: 0.25,
        }}
      />
    </View>
  )
}
