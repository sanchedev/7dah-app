import { useColors } from '@/hooks/colors'
import { View, ViewProps } from 'react-native'

export interface CardViewProps extends ViewProps {}

export function CardView({ style, ...props }: CardViewProps) {
  const colors = useColors()

  return (
    <View
      style={[
        {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: colors.cardForeground + '22',
          padding: 16,
          borderRadius: 16,
          gap: 8,
        },
        style,
      ]}
      {...props}
    />
  )
}
