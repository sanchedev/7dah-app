import { usePlaylists } from '@/hooks/audio/playlists'
import { Playlist } from '@/lib/audio/types'
import { router } from 'expo-router'
import { View } from 'react-native'
import { Carousel } from '../ui/carousel/carousel'
import { Icon } from '../ui/icon'
import { IconButton } from '../ui/icon-button'
import { ListItem } from '../ui/list-item'
import { UiText } from '../ui/text'
import { VisualCard } from '../visuals/visual-card'

export function PlaylistsCarousel() {
  const playlists = usePlaylists()

  const filteredHymns = playlists.filter((p) => p.hymns.length > 0)

  if (playlists.length < 1)
    return (
      <>
        <ListItem
          leadingComp={() => <Icon name='queue-music' />}
          title='No tienes Playlists'
          subtitle='Prueba creando alguna'
          onPress={() => router.push('/playlists/create')}
        />
      </>
    )
  if (filteredHymns.length < 1)
    return (
      <>
        <ListItem
          leadingComp={() => <Icon name='queue-music' />}
          title='Tus Playlists están Vacias'
          subtitle='Agrega un Himno a tu Playlist usando el ícono abajo de los controles del reproductor de música.'
          onPress={() => router.push('/search/specific')}
        />
      </>
    )

  return (
    <>
      <View style={{ width: '100%', flexDirection: 'row', gap: 16 }}>
        <UiText style={{ marginBottom: 4, flex: 1 }} variant={'subtitle'}>
          Tus Playlists
        </UiText>
        <IconButton
          iconName='chevron-right'
          onPress={() => router.navigate('/lists')}
        />
      </View>
      <Carousel
        data={playlists.map((cat) => ({ id: cat.id, props: cat }))}
        cardComponent={(cat: Playlist) => (
          <VisualCard
            visualId={cat.visualId}
            title={cat.name}
            subtitle={`${cat.hymns.length} Himno${cat.hymns.length === 1 ? '' : 's'}`}
            onPress={() =>
              router.navigate({
                pathname: '/playlists/[playlistId]',
                params: { playlistId: cat.id },
              })
            }
          />
        )}
      />
    </>
  )
}
