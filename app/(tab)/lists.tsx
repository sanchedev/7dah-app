import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { PlaylistItem } from '@/components/playlist/playlist-item'
import { Icon } from '@/components/ui/icon'
import { IconButton } from '@/components/ui/icon-button'
import { ItemSeparator, ListItem } from '@/components/ui/list-item'
import { useFavorites } from '@/hooks/audio/favorites'
import { usePlaylists } from '@/hooks/audio/playlists'
import { router } from 'expo-router'
import { Fragment } from 'react'
import Animated from 'react-native-reanimated'

export default function ListsScreen() {
  return (
    <NavBarContainer
      title='Listas'
      ScrollComponent={ScrollComponent}
      leadingComponent={ActionComponent}
    />
  )
}

function ScrollComponent({ scrollHandler, style }: ScrollComponentProps) {
  const favorites = useFavorites()
  const playlists = usePlaylists()

  return (
    <Animated.ScrollView
      contentContainerStyle={[
        style,
        {
          flex: 1,
        },
      ]}
      onScroll={scrollHandler}>
      <ListItem
        leadingComp={() => <Icon name='favorite' />}
        title='Favoritos'
        subtitle={`${favorites.length} Himno(s)`}
        onPress={() => router.push('/playlists/favorites')}
      />
      <ItemSeparator />
      {playlists.map((playlist, i) => (
        <Fragment key={playlist.id}>
          <PlaylistItem playlist={playlist} />
          {i < playlists.length && <ItemSeparator />}
        </Fragment>
      ))}
      <ListItem
        leadingComp={() => <Icon name='download' />}
        title='Descargados'
        subtitle={`Próximamente...`}
        onPress={() => router.push('/playlists/downloadeds')}
        disabled
      />
    </Animated.ScrollView>
  )
}

function ActionComponent() {
  return (
    <IconButton
      iconName='add'
      onPress={() => router.push('/playlists/create')}
    />
  )
}
