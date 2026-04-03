import { CategoryCard } from '@/components/category/category-card'
import { HymnCarousel } from '@/components/hymn/hymns-carousel'
import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { IconButton } from '@/components/ui/icon-button'
import { UiText } from '@/components/ui/text'
import { useFavorites } from '@/hooks/audio/favorites'
import { useHistory } from '@/hooks/audio/history'
import { usePlaylists } from '@/hooks/audio/playlists'
import { useColors } from '@/hooks/colors'
import { Categories } from '@/lib/categories/categories'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import React from 'react'
import Animated from 'react-native-reanimated'

export default function Screen() {
  return (
    <NavBarContainer
      title='7dAH App'
      ScrollComponent={ScrollComponent}
      ActionComponent={ActionComponent}
    />
  )
}

function ScrollComponent(props: ScrollComponentProps) {
  const colors = useColors()
  const history = useHistory()
  const favorites = useFavorites()
  const playlists = usePlaylists()

  return (
    <Animated.FlatList<CarouselList>
      contentContainerStyle={[
        props.style,
        {
          backgroundColor: colors.background,
          paddingBottom: 128,
        },
      ]}
      onScroll={props.scrollHandler}
      scrollEventThrottle={16}
      data={[
        ...(history.length > 0
          ? ([
              {
                id: 'h-title',
                type: 'text',
                variant: 'subtitle',
                label: 'Escuchados Recientemente',
              },
              {
                id: 'h-carousel',
                type: 'carousel',
                data: history.map((hymnId) => ({ hymnId })),
              },
            ] as const)
          : []),
        ...(favorites.length > 0
          ? ([
              {
                id: 'f-title',
                type: 'text',
                variant: 'subtitle',
                label: 'Tus Favoritos',
              },
              {
                id: 'f-carousel',
                type: 'carousel',
                data: favorites.map((hymnId) => ({ hymnId })),
              },
            ] as const)
          : []),
        ...(playlists.length > 0
          ? ([
              {
                id: 'p-title',
                type: 'text',
                variant: 'title',
                label: 'Tus Playlists',
              },
              ...playlists.flatMap<CarouselList>((playlist) =>
                playlist.hymns.length < 1
                  ? []
                  : [
                      {
                        id: 'p-' + playlist.id + '-title',
                        type: 'text',
                        variant: 'subtitle',
                        label: playlist.name,
                      },
                      {
                        id: 'p-' + playlist.id + '-carousel',
                        type: 'carousel',
                        data: playlist.hymns.map((hymnId) => ({
                          hymnId,
                          playlistId: playlist.id,
                        })),
                      },
                    ],
              ),
            ] as const)
          : []),
        {
          id: 'cat-title',
          type: 'text',
          variant: 'title',
          label: 'Categorías',
        },
        {
          id: 'cat-carousel',
          type: 'carousel-cat',
        },
      ]}
      renderItem={({ item }) =>
        item.type === 'text' ? (
          <UiText
            style={{ marginBottom: item.variant === 'title' ? 6 : 4 }}
            variant={item.variant}>
            {item.label}
          </UiText>
        ) : item.type === 'carousel' ? (
          <HymnCarousel data={item.data} style={{ marginBottom: 16 }} />
        ) : (
          <CategoryCarousel />
        )
      }></Animated.FlatList>
  )
}

type CarouselList =
  | {
      id: string
      type: 'text'
      variant: 'title' | 'subtitle'
      label: string
    }
  | {
      id: string
      type: 'carousel'
      data: {
        hymnId: string
        playlistId?: string | undefined
      }[]
    }
  | {
      id: string
      type: 'carousel-cat'
    }

function CategoryCarousel() {
  const categories = Categories.getAll()
  return (
    <FlashList
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment='center'
      pagingEnabled
      decelerationRate='fast'
      data={categories}
      keyExtractor={({ id }) => `card-${id}`}
      renderItem={({ item }) => (
        <CategoryCard category={item} style={{ marginRight: 8 }} />
      )}
    />
  )
}

function ActionComponent() {
  return <IconButton iconName='search' onPress={() => router.push('/search')} />
}
