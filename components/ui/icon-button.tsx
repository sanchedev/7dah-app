import { useColors } from '@/hooks/colors'
import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, PressableProps, View } from 'react-native'

export interface IconButtonProps extends PressableProps {
  iconName: ConstructorParameters<typeof MaterialIcons>[0]['name']
  filled?: boolean
  iconSize?: IconSize
}

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<IconSize, number> = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
}

export function IconButton({
  iconName,
  filled,
  iconSize = 'md',
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
              backgroundColor: colors.hoverBg,
            },
            filled && {
              borderRadius: '100%',
              backgroundColor: colors.text,
            },
            filled &&
              pressed && {
                backgroundColor: colors.text + 'aa',
              },
          ]}>
          <MaterialIcons
            name={iconName}
            size={sizes[iconSize]}
            style={{ color: !filled ? colors.text : colors.background }}
          />
        </View>
      )}
    </Pressable>
  )
}
