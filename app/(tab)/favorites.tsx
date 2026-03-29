import { FavoriteButton } from '@/components/audio/favorite-button'
import { AnimatedHymnList } from '@/components/hymn/hymn-list'
import { NavBarContainer } from '@/components/nav-bar-container'
import { UiText } from '@/components/ui/text'
import { useFavorites } from '@/hooks/audio/favorites'
import { hymns } from '@/lib/hymns'
import { Hymn } from '@/lib/types'
import { View } from 'react-native'
import { ScrollHandlerProcessed } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function FavoritesScreen() {
  return <NavBarContainer title='Favoritos' ScrollComponent={ScrollComponent} />
}

function ScrollComponent({
  scrollHandler,
  paddingTop,
}: {
  paddingTop: number
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>
}) {
  const favorites = useFavorites()
  const { left, right } = useSafeAreaInsets()

  return (
    <>
      {favorites.size < 1 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <UiText variant='special'>No tienes Favoritos</UiText>
        </View>
      ) : (
        <AnimatedHymnList
          hymns={[...favorites].map((f) => hymns[f - 1])}
          contentContainerStyle={{
            paddingTop: paddingTop,
            paddingLeft: left,
            paddingRight: right,
          }}
          onScroll={scrollHandler}
          action={FavoriteAction}
        />
      )}
    </>
  )
}

function FavoriteAction({ hymn }: { hymn: Hymn }) {
  return <FavoriteButton hymnNumber={hymn.number} />
}
