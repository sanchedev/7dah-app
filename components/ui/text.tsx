import { useColors } from '@/hooks/colors'
import { StyleProp, Text, TextStyle, type TextProps } from 'react-native'
import Animated from 'react-native-reanimated'

export interface UiTextProps extends TextProps {
  variant?: TextVariant
}

type TextVariant = 'normal' | 'title' | 'subtitle' | 'bold' | 'h3' | 'special'

const styles: Record<TextVariant, StyleProp<TextStyle>> = {
  normal: {},
  bold: { fontWeight: 700 },
  title: { fontSize: 24, fontFamily: 'RosarioBold' },
  subtitle: { fontSize: 20, fontFamily: 'RosarioBold' },
  h3: { fontSize: 16, fontWeight: 700 },
  special: { fontFamily: 'Rosario' },
}

export function UiText({ variant, style, ...props }: UiTextProps) {
  const colors = useColors()

  return (
    <Text
      {...props}
      style={[
        {
          color: colors.text,
        },
        styles[variant ?? 'normal'],
        style,
      ]}
    />
  )
}
export function AnimatedUiText({ variant, style, ...props }: UiTextProps) {
  const colors = useColors()

  return (
    <Animated.Text
      {...props}
      style={[
        {
          color: colors.text,
        },
        styles[variant ?? 'normal'],
        style,
      ]}
    />
  )
}
