import { useColors } from '@/hooks/colors'
import { BlurTargetView, BlurView } from 'expo-blur'
import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  ScrollHandlerProcessed,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { UiText } from './ui/text'

const NAV_HEIGHT = 72

interface NavBarContainerProps {
  ScrollComponent: (props: {
    paddingTop: number
    scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>
  }) => React.ReactNode

  title: string
  ActionComponent?: () => React.ReactNode
}

export function NavBarContainer({
  ScrollComponent,
  title,
  ActionComponent,
}: NavBarContainerProps) {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const navHeight = NAV_HEIGHT + insets.top

  const scrollY = useSharedValue(0)

  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y
      scrollY.value = y
    },
  })

  const blurStyle = useAnimatedStyle(() => {
    const intensity = interpolate(
      scrollY.value,
      [0, navHeight],
      [0, 1],
      Extrapolation.CLAMP,
    )

    return {
      opacity: intensity,
    }
  })

  const targetRef = useRef<View | null>(null)

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <BlurTargetView ref={targetRef} style={{ flex: 1 }}>
        <ScrollComponent
          scrollHandler={handler}
          paddingTop={insets.top + NAV_HEIGHT}
        />
      </BlurTargetView>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: navHeight,
            paddingTop: insets.top,
            justifyContent: 'center',
            paddingHorizontal: 16,
          },
        ]}>
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFill,
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
          <UiText style={{ fontSize: 18, fontFamily: 'RosarioBold' }}>
            {title}
          </UiText>
          {ActionComponent && <ActionComponent />}
        </View>
      </Animated.View>
    </View>
  )
}
