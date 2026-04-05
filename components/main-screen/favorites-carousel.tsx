import { useFavorites } from '@/hooks/audio/favorites'
import { router } from 'expo-router'
import { View } from 'react-native'
import { HymnCarousel } from '../hymn/hymns-carousel'
import { Icon } from '../ui/icon'
import { IconButton } from '../ui/icon-button'
import { ItemSeparator, ListItem } from '../ui/list-item'
import { UiText } from '../ui/text'

export function FavoritesCarousel() {
  const favorites = useFavorites()

  if (favorites.length === 0)
    return (
      <>
        <ListItem
          leadingComp={() => <Icon name='favorite' />}
          title='Parece que aún no tienes Favoritos.'
          subtitle='Al entrar a un Himno dale al corazón arriba a la derecha para "añadir a Favoritos"'
          onPress={() => router.push('/search/specific')}
        />
        <ItemSeparator />
      </>
    )

  return (
    <>
      <View style={{ width: '100%', flexDirection: 'row', gap: 16 }}>
        <UiText style={{ marginBottom: 4, flex: 1 }} variant={'subtitle'}>
          Tus Favoritos
        </UiText>
        <IconButton
          iconName='chevron-right'
          onPress={() => router.navigate('/playlists/favorites')}
        />
      </View>
      <HymnCarousel data={favorites.map((hymnId) => ({ hymnId }))} />
    </>
  )
}
