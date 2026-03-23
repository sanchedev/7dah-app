import { HymnItem } from '@/components/hymn/hymn-item'
import { HymnCarousel } from '@/components/hymn/hymns-carousel'
import { IconButton } from '@/components/ui/icon-button'
import { UiText } from '@/components/ui/text'
import { useColors } from '@/hooks/colors'
import { hymns } from '@/lib/hymns'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import React, { Fragment, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const NAV_HEIGHT = 72

export default function Screen() {
  const { top, bottom } = useSafeAreaInsets()
  const navHeight = NAV_HEIGHT + top

  const scrollY = useSharedValue(0)

  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y
      scrollY.value = y
    },
  })

  const opacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, navHeight],
      [0, 0.85],
      Extrapolation.CLAMP,
    )

    return { opacity }
  })

  const blurStyle = useAnimatedStyle(() => {
    const intensity = interpolate(
      scrollY.value,
      [0, navHeight],
      [0, 1],
      Extrapolation.CLAMP,
    )

    return {
      // hack: blur se pasa como prop, pero usamos estilo para sincronizar
      opacity: intensity,
    }
  })

  const colors = useColors()
  const router = useRouter()
  const targetRef = useRef<View | null>(null)

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BlurTargetView ref={targetRef}>
        <Animated.ScrollView
          contentContainerStyle={{
            paddingTop: navHeight + 16,
            paddingBottom: bottom,
            backgroundColor: colors.background,
          }}
          onScroll={handler}
          scrollEventThrottle={16}>
          <UiText
            style={{ marginHorizontal: 16, marginBottom: 4 }}
            variant='subtitle'>
            Vistos Recientemente
          </UiText>
          <HymnCarousel
            hymns={hymns.slice(0, 10)}
            style={{ marginBottom: 16 }}
          />
          <UiText
            style={{ marginHorizontal: 16, marginBottom: 4 }}
            variant='subtitle'>
            Todos los Himnos
          </UiText>
          {hymns.slice(0, 40).map((hymn, index) => (
            <Fragment key={`Hymn-${hymn.number}`}>
              {index !== 0 && (
                <View
                  style={{
                    backgroundColor: colors.text,
                    opacity: 0.1,
                    width: '100%',
                    height: 1,
                    marginHorizontal: 8,
                  }}
                />
              )}
              <HymnItem hymn={hymn} />
            </Fragment>
          ))}
        </Animated.ScrollView>
      </BlurTargetView>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: navHeight,
            paddingTop: top,
            justifyContent: 'center',
            paddingHorizontal: 16,
          },
        ]}>
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFill,
              borderBottomWidth: 1,
              borderBottomColor: colors.text + '44',
            },
            blurStyle,
          ]}>
          <BlurView
            blurTarget={targetRef}
            intensity={100}
            tint={colors.theme}
            blurMethod='dimezisBlurView'
            style={{ flex: 1 }}
          />
        </Animated.View>
        <View
          style={[
            {
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <UiText style={{ fontSize: 18, fontWeight: '700' }}>7DAH App</UiText>
          <IconButton
            iconName='search'
            onPress={() => router.push('/search')}
          />
        </View>
      </Animated.View>
    </View>
  )
}
