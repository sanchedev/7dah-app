import { Favorites } from '@/lib/audio/favorites'
import { useSignalState } from '../signal'

export function useFavorites() {
  const [favorites] = useSignalState(
    Favorites.favoritesChanged,
    Favorites.get(),
  )

  return favorites
}
