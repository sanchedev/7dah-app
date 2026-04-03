import { ColorTheme } from '@/constants/theme'
import { useColors } from '@/hooks/colors'
import { Pressable, PressableProps, View } from 'react-native'
import { Icon, IconProps } from './icon'

export interface IconButtonProps extends PressableProps {
  iconName: IconProps['name']
  iconSize?: IconProps['iconSize']
  iconColor?: keyof ColorTheme
  color?: keyof ColorTheme
  hover?: keyof ColorTheme
  filled?: boolean
}

export function IconButton({
  iconName,
  filled,
  iconSize = 'md',
  iconColor,
  color,
  hover,
  disabled,
  ...props
}: IconButtonProps) {
  const colors = useColors()

  return (
    <Pressable disabled={disabled} {...props}>
      {({ pressed }) => (
        <View
          style={[
            {
              padding: 8,
            },
            disabled && {
              opacity: 0.5,
            },
            pressed && {
              borderRadius: '100%',
              backgroundColor:
                hover != null ? colors[hover] + 'aa' : colors.hoverBackground,
            },
            filled && {
              borderRadius: '100%',
              backgroundColor: colors[color ?? 'primaryBackground'],
            },
            filled &&
              pressed && {
                backgroundColor:
                  hover === 'hoverBackground'
                    ? colors[hover]
                    : colors[hover ?? 'primaryBackground'] + 'aa',
              },
          ]}>
          <Icon
            name={iconName}
            iconSize={iconSize}
            color={iconColor ?? (filled ? 'primaryForeground' : 'foreground')}
          />
        </View>
      )}
    </Pressable>
  )
}
