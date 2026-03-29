import { NavBarContainer } from '@/components/nav-bar-container'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Icon } from '@/components/ui/icon'
import { IconButton } from '@/components/ui/icon-button'
import { ItemSeparator, ListItem } from '@/components/ui/list-item'
import { UiText } from '@/components/ui/text'
import { usePlaylists } from '@/hooks/audio/playlists'
import { Playlists } from '@/lib/audio/playlists'
import { Playlist } from '@/lib/audio/types'
import {
  getVisualAsset,
  getVisualFromHymn,
  getVisualFromId,
} from '@/lib/visuals'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, View } from 'react-native'
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function PlaylistScreen() {
  return (
    <NavBarContainer
      title='Playlists'
      ScrollComponent={ScrollComponent}
      ActionComponent={AddPlaylist}
    />
  )
}

function ScrollComponent({
  scrollHandler,
  paddingTop,
}: {
  paddingTop: number
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>
}) {
  const playlists = usePlaylists()
  const { left, right } = useSafeAreaInsets()

  const [playlistMenuId, setPMId] = useState<string | null>(null)

  return (
    <>
      {playlists.length < 1 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <UiText variant='special'>No tienes Playlists</UiText>
        </View>
      ) : (
        <>
          <Animated.FlatList
            data={playlists}
            contentContainerStyle={{
              paddingTop,
              paddingLeft: left + 8,
              paddingRight: right + 8,
              flex: 1,
            }}
            ItemSeparatorComponent={() => <ItemSeparator />}
            keyExtractor={({ id }) => `playlist-${id}`}
            onScroll={scrollHandler}
            renderItem={({ item }) => (
              <PlaylistItem
                playlist={item}
                trailingComp={() => (
                  <IconButton
                    iconName='menu'
                    onPress={() => setPMId(item.id)}
                  />
                )}
              />
            )}
          />

          <PlaylistMenu
            playlistId={playlistMenuId ?? undefined}
            onClose={() => setPMId(null)}
          />
        </>
      )}
    </>
  )
}

interface PlaylistItemProps {
  playlist: Playlist
  trailingComp?: () => React.ReactNode
}

const ITEM_HEIGHT = 64

function PlaylistItem({ playlist, trailingComp }: PlaylistItemProps) {
  const visual = getVisualFromId(playlist.visualId) ?? getVisualFromHymn(1)!
  const visualAsset = getVisualAsset(visual.id)!

  const router = useRouter()

  return (
    <ListItem
      leadingComp={() => (
        <Image
          source={visualAsset}
          style={{ flex: 1, aspectRatio: 1 }}
          width={ITEM_HEIGHT}
          height={ITEM_HEIGHT}
          borderRadius={4}
        />
      )}
      title={playlist.name}
      subtitle={`${playlist.hymns.length} Himno(s)`}
      trailingComp={trailingComp}
      onPress={() =>
        router.navigate({
          pathname: '/playlists/[playlistId]',
          params: { playlistId: playlist.id },
        })
      }
    />
  )
}

function AddPlaylist() {
  const router = useRouter()
  return (
    <IconButton
      iconName='add'
      onPress={() => router.push('/playlists/create')}
    />
  )
}

function PlaylistMenu({
  playlistId,
  onClose,
}: {
  playlistId?: string
  onClose: () => void
}) {
  return (
    <BottomSheet visible={playlistId != null} onClose={onClose}>
      <ListItem
        leadingComp={() => <Icon name='delete' />}
        title='Eliminar'
        onPress={() => playlistId && Playlists.delete(playlistId) && onClose()}
      />
    </BottomSheet>
  )
}
