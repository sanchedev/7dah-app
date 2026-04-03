import { useColors } from '@/hooks/colors'
import { useVisual } from '@/hooks/visuals/visual'
import { Image } from 'expo-image'
import { useRef } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

interface HymnBackgroundProps extends ViewProps {
  visualId?: string
}

export default function VisualBackground({
  visualId,
  style,
  ...props
}: HymnBackgroundProps) {
  const visual = useVisual(visualId)

  const targetRef = useRef<View | null>(null)
  const colors = useColors()

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background, ...style }}
      {...props}>
      <Image
        source={{ uri: visual?.url }}
        style={{ flex: 1, ...StyleSheet.absoluteFill, opacity: 0.25 }}
        blurRadius={75}
      />
      {props.children}
    </View>
  )
}
