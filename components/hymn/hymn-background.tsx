import { useColors } from '@/hooks/colors'
import { getVisualAsset } from '@/lib/visuals'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRef } from 'react'
import { Image, StyleSheet, View, ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface HymnBackgroundProps extends ViewProps {
  visualId: string
}

export default function VisualBackground({
  visualId,
  style,
  ...props
}: HymnBackgroundProps) {
  const visualAsset = getVisualAsset(visualId)!

  const targetRef = useRef<View | null>(null)
  const colors = useColors()

  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BlurTargetView
        ref={targetRef}
        style={{
          flex: 1,
          flexWrap: 'wrap',
          ...StyleSheet.absoluteFill,
        }}>
        <Image source={visualAsset} width={1024} height={1024} />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.background, opacity: 0.5 },
          ]}
        />
      </BlurTargetView>
      <BlurView
        blurTarget={targetRef}
        intensity={100}
        tint={colors.theme}
        style={[
          {
            flex: 1,
          },
          style,
        ]}
        blurMethod='dimezisBlurView'
        {...props}>
        {props.children}
      </BlurView>
    </View>
  )
}
