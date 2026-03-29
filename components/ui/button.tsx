import { ColorTheme } from '@/constants/theme'
import { useColors } from '@/hooks/colors'
import { Pressable, PressableProps } from 'react-native'

export interface ButtonProps extends PressableProps {
  color?: keyof ColorTheme
  hover?: keyof ColorTheme
  disabled?: boolean
}

export function Button({ color, hover, disabled, ...props }: ButtonProps) {
  const colors = useColors()

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: colors[color ?? 'primaryBackground'],
        },
        disabled && {
          opacity: 0.5,
        },
        pressed && {
          borderRadius: 8,
          backgroundColor:
            hover === 'hoverBackground'
              ? colors['hoverBackground']
              : colors[hover ?? 'primaryBackground'] + 'aa',
        },
      ]}
      {...props}></Pressable>
  )
}
