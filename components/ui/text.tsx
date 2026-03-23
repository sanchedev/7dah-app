import { useColors } from '@/hooks/colors'
import { StyleProp, Text, TextStyle, type TextProps } from 'react-native'

export interface UiTextProps extends TextProps {
  variant?: TextVariant
}

type TextVariant = 'normal' | 'title' | 'subtitle' | 'bold' | 'h3'

const styles: Record<TextVariant, StyleProp<TextStyle>> = {
  normal: {},
  bold: { fontWeight: 700 },
  title: { fontSize: 24, fontWeight: 700, fontFamily: 'Rosario' },
  subtitle: { fontSize: 20, fontWeight: 700, fontFamily: 'Rosario' },
  h3: { fontSize: 16, fontWeight: 700 },
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
