import {
  useBottomSheet,
  useBottomSheetCloseOnNavigate,
} from '@/hooks/bottom-sheet'
import { useVisual } from '@/hooks/visuals/visual'
import { Current } from '@/lib/audio/current'
import { Playlists } from '@/lib/audio/playlists'
import { Playlist } from '@/lib/audio/types'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Dimensions, ScaledSize, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LoopButton } from '../audio/loop-button'
import { PlayPauseButton } from '../audio/play-button'
import { ShuffleButton } from '../audio/shuffle-button'
import VisualBackground from '../hymn/hymn-background'
import { CardView } from '../ui/card'
import { Icon } from '../ui/icon'
import { IconButton } from '../ui/icon-button'
import { ListItem } from '../ui/list-item'
import { UiText } from '../ui/text'
import { DraggablePlaylist } from './draggable-playlist'

interface PlaylistViewerProps {
  playlist: Playlist
}

const getSize = ({ window }: { window?: ScaledSize } = {}) => {
  const dimensions = window ?? Dimensions.get('window')
  return Math.min(dimensions.height, dimensions.width)
}

export function PlaylistViewer({ playlist }: PlaylistViewerProps) {
  const visual = useVisual(playlist.visualId)

  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [cardSize, setCardSize] = useState(getSize())

  const cardPadd = Math.min(384, cardSize - 32 + insets.left + insets.right)

  useEffect(() => {
    const onResize = (dimensions: { window: ScaledSize }) => {
      setCardSize(getSize(dimensions))
    }
    Dimensions.addEventListener('change', onResize)
  }, [])

  const [order, setOrder] = useState(playlist.hymns.map((_, i) => i))
  const moveItem = useCallback((from: number, to: number) => {
    setOrder((prev) => {
      if (from === to) return prev

      const newOrder = [...prev]
      const item = newOrder.splice(from, 1)[0]
      newOrder.splice(to, 0, item)

      return newOrder
    })
  }, [])
  function handleDrop(from: number, to: number) {
    if (from !== to) {
      Playlists.addHymn(playlist.id, playlist.hymns[from], to)
      setOrder(playlist.hymns.map((_, i) => i))
    }
  }

  useEffect(() => {
    if (playlist.hymns.length !== order.length) {
      setOrder(playlist.hymns.map((_, i) => i))
    }
  }, [playlist.hymns])

  useBottomSheetCloseOnNavigate()

  const modal = useBottomSheet()

  const handleMenu = () => {
    modal.openSheet([
      {
        id: 'delete-playlist',
        comp: ListItem,
        props: {
          leadingComp: () => <Icon name='delete' />,
          title: 'Borrar Playlist',
          subtitle: 'Acción irreversible',
          onPress: () =>
            Alert.alert(
              '¿Seguro(a) de Eliminar esta Playlist?',
              'Esta acción es irreversible.',
              [
                {
                  style: 'destructive',
                  text: 'Eliminar',
                  onPress: () => {
                    modal.closeSheet()
                    router.back()
                    Playlists.delete(playlist.id)
                  },
                },
                {
                  style: 'cancel',
                  text: 'Cancelar',
                  isPreferred: true,
                  onPress: () => modal.closeSheet(),
                },
              ],
            ),
        },
      },
    ])
  }

  return (
    <VisualBackground visualId={playlist.visualId}>
      <ScrollView
        style={{
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingTop: insets.top + 8,
            height: 56 + insets.top,
            paddingBottom: 8,
            justifyContent: 'space-between',
          }}>
          <IconButton iconName='arrow-back' onPress={() => router.back()} />
          {playlist.id !== 'favorites' && (
            <IconButton iconName='menu' onPress={handleMenu} />
          )}
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 16,
          }}>
          <Image
            source={{ uri: visual?.url }}
            style={{
              aspectRatio: 1,
              width: cardPadd,
              height: cardPadd,
              borderRadius: cardPadd / 16,
            }}
          />
        </View>
        <View
          style={{
            marginVertical: 4,
            width: '100%',
            flexDirection: 'row',
            gap: 16,
          }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <UiText
              variant='subtitle'
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                marginVertical: 4,
              }}>
              {playlist.name}
            </UiText>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            marginTop: 16,
            marginBottom: 32,
          }}>
          <PlayPauseBtn playlist={playlist} />
          <ShuffleButton iconSize='md' />
          <LoopButton iconSize='md' />
        </View>
        <CardView style={{ padding: 8 }}>
          {playlist.hymns.length === 0 && (
            <View
              style={{
                height: 128,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <UiText variant='special' color='cardForeground'>
                No has agregado himnos a tu playlist
              </UiText>
            </View>
          )}
          {order.map((i, index) => {
            const hymnId = playlist.hymns[i]

            return (
              <DraggablePlaylist
                key={hymnId}
                hymnId={hymnId}
                index={index}
                action={() => (
                  <PlayPauseAction hymnId={hymnId} playlist={playlist} />
                )}
                playlistId={playlist.id}
                move={moveItem}
                onDrop={handleDrop}
                total={order.length}
              />
            )
          })}
        </CardView>
        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </VisualBackground>
  )
}

function PlayPauseBtn({ playlist }: { playlist: Playlist }) {
  return (
    <PlayPauseButton
      info={{
        playlistId: playlist.id,
      }}
      iconSize='lg'
      filled
      disabled={playlist.hymns.length === 0}
    />
  )
}

function PlayPauseAction({
  playlist,
  hymnId,
}: {
  playlist: Playlist
  hymnId: string
}) {
  return (
    <PlayPauseButton
      info={{
        playlistId: playlist.id,
        index: Current.indexOf(hymnId, playlist.id),
      }}
    />
  )
}
