import { useFavorites } from '@/hooks/audio/favorites'
import { Favorites } from '@/lib/audio/favorites'
import { IconButton, IconButtonProps } from '../ui/icon-button'

interface FavoriteButtonProps extends Omit<IconButtonProps, 'iconName'> {
  hymnNumber: number
}

export function FavoriteButton({
  hymnNumber,
  onPress,
  ...props
}: FavoriteButtonProps) {
  const favorites = useFavorites()
  const isFavorite = favorites.has(hymnNumber)

  return (
    <IconButton
      iconName={isFavorite ? 'favorite' : 'favorite-border'}
      iconColor='secondaryForeground'
      onPress={(ev) => {
        onPress?.(ev)
        Favorites.toggle(hymnNumber)
      }}
      {...props}
    />
  )
}
