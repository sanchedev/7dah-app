import { ColorTheme } from '@/constants/theme'
import { useColors } from '@/hooks/colors'
import { MaterialIcons } from '@expo/vector-icons'

type MaterialIconsProps = ConstructorParameters<typeof MaterialIcons>[0]

export interface IconProps extends MaterialIconsProps {
  iconSize?: IconSize
  color?: keyof ColorTheme
}

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const iconSizes: Record<IconSize, number> = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
}

export function Icon({ iconSize, color, ...props }: IconProps) {
  const colors = useColors()

  return (
    <MaterialIcons
      size={iconSizes[iconSize ?? 'md']}
      {...props}
      style={{ color: colors[color ?? 'foreground'] }}
    />
  )
}
