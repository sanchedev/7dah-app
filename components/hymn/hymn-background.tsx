import { useColors } from '@/hooks/colors'
import { useVisual } from '@/hooks/visuals/visual'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRef } from 'react'
import { Image, StyleSheet, View, ViewProps } from 'react-native'

interface HymnBackgroundProps extends ViewProps {
  visualId: string
}

export default function VisualBackground({
  visualId,
  style,
  ...props
}: HymnBackgroundProps) {
  const visual = useVisual(visualId)!

  const targetRef = useRef<View | null>(null)
  const colors = useColors()

  return (
    <View style={{ flex: 1 }}>
      <BlurTargetView
        ref={targetRef}
        style={{
          flex: 1,
          flexWrap: 'wrap',
          ...StyleSheet.absoluteFill,
        }}>
        <Image source={{ uri: visual.url }} width={1024} height={1024} />
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
