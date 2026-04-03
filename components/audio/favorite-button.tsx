import { useFavorites } from '@/hooks/audio/favorites'
import { Favorites } from '@/lib/audio/favorites'
import { IconButton, IconButtonProps } from '../ui/icon-button'

interface FavoriteButtonProps extends Omit<IconButtonProps, 'iconName'> {
  hymnId: string
}

export function FavoriteButton({
  hymnId,
  onPress,
  ...props
}: FavoriteButtonProps) {
  const favorites = useFavorites()
  const isFavorite = favorites.includes(hymnId)

  return (
    <IconButton
      iconName={isFavorite ? 'favorite' : 'favorite-border'}
      iconColor='secondaryForeground'
      onPress={(ev) => {
        onPress?.(ev)
        Favorites.toggle(hymnId)
      }}
      {...props}
    />
  )
}
