import { ColorTheme } from '@/constants/theme'
import { useColors } from '@/hooks/colors'
import { Text, TextStyle, type TextProps } from 'react-native'
import Animated from 'react-native-reanimated'

export interface UiTextProps extends TextProps {
  variant?: TextVariant
  color?: keyof ColorTheme
}

type TextVariant = 'normal' | 'title' | 'subtitle' | 'bold' | 'h3' | 'special'

const styles: Record<TextVariant, TextStyle> = {
  normal: {},
  bold: { fontWeight: 700 },
  title: { fontSize: 24, fontFamily: 'RosarioBold' },
  subtitle: { fontSize: 20, fontFamily: 'RosarioBold' },
  h3: { fontSize: 16, fontWeight: 700 },
  special: { fontFamily: 'Rosario' },
}

export function UiText({ variant, style, color, ...props }: UiTextProps) {
  const colors = useColors()

  return (
    <Text
      {...props}
      style={[
        {
          color: colors[color ?? 'foreground'],
        },
        styles[variant ?? 'normal'],
        style,
      ]}
    />
  )
}
export function AnimatedUiText({
  variant,
  style,
  color,
  ...props
}: UiTextProps) {
  const colors = useColors()

  return (
    <Animated.Text
      {...props}
      style={[
        {
          color: colors[color ?? 'foreground'],
        },
        styles[variant ?? 'normal'],
        style,
      ]}
    />
  )
}
