import { useColors } from '@/hooks/colors'
import React, { ReactNode, useEffect } from 'react'
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const MIN_HEIGHT = 64

type Props = {
  visible: boolean
  onClose: () => void
  children?: ReactNode
}

export function BottomSheet({ visible, onClose, children }: Props) {
  const colors = useColors()

  const INITIAL_HEIGHT = Math.min(480, SCREEN_HEIGHT * 0.5)

  const translateY = useSharedValue(SCREEN_HEIGHT)
  const startY = useSharedValue(0)
  const scrollY = useSharedValue(0)

  const SNAP_OPEN = SCREEN_HEIGHT - INITIAL_HEIGHT
  const SNAP_CLOSED = SCREEN_HEIGHT
  const SNAP_MIN = SCREEN_HEIGHT - MIN_HEIGHT
  const SNAP_FULL = 0

  // 👇 abrir / cerrar
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(SNAP_OPEN)
    } else {
      close(true)
    }
  }, [visible])

  const close = (closed?: boolean) => {
    translateY.value = withTiming(SNAP_CLOSED, {}, () => {
      if (closed) return
      scheduleOnRN(onClose)
    })
  }

  // 👇 gesto
  const pan = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value
    })
    .onUpdate((e) => {
      let next = startY.value + e.translationY
      next = clamp(next, SNAP_FULL, SNAP_CLOSED)

      if (scrollY.value <= 0 || e.translationY > 0) {
        translateY.value = next
      }
    })
    .onEnd((e) => {
      const velocity = e.velocityY

      if (velocity > 800) {
        scheduleOnRN(close)
        return
      }

      if (velocity < -800) {
        translateY.value = withSpring(SNAP_FULL)
        return
      }

      const middle = (SNAP_OPEN + SNAP_FULL) / 2

      if (translateY.value > SNAP_MIN) {
        scheduleOnRN(close)
      } else if (translateY.value < middle) {
        translateY.value = withSpring(SNAP_FULL)
      } else {
        translateY.value = withSpring(SNAP_OPEN)
      }
    })

  // 🎬 animación del sheet
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  // 🌑 animación del backdrop
  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SNAP_CLOSED, SNAP_OPEN, SNAP_FULL],
      [0, 0.4, 0.6],
    )

    return {
      opacity,
    }
  })

  // 👆 cerrar desde backdrop
  const handleBackdropPress = () => {
    close()
  }

  return (
    <>
      {visible && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'black' },
              backdropStyle,
            ]}></Animated.View>
        </Pressable>
      )}

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              height: SCREEN_HEIGHT,
              width: '100%',
              backgroundColor: colors.surfaceBackground,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              overflow: 'hidden',
              zIndex: 10,
            },
            sheetStyle,
          ]}>
          <View
            style={{
              padding: 12,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 40,
                height: 5,
                borderRadius: 3,
                backgroundColor: colors.secondaryBackground,
              }}
            />
          </View>

          <ScrollView
            scrollEventThrottle={16}
            onScroll={(e) => {
              scrollY.value = e.nativeEvent.contentOffset.y
            }}>
            <View
              style={{
                padding: 16,
                minHeight: SCREEN_HEIGHT,
              }}>
              {children}
            </View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </>
  )
}
