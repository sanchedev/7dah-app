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
  lg: 32,
  xl: 40,
}

export function IconButton({
  iconName,
  filled,
  iconSize = 'md',
  ...props
}: IconButtonProps) {
  const colors = useColors()

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View
          style={[
            {
              padding: 8,
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
