import { CategoriesCarousel } from '@/components/main-screen/categories-carousel'
import { FavoritesCarousel } from '@/components/main-screen/favorites-carousel'
import { HistoryCarousel } from '@/components/main-screen/history-carousel'
import { PlaylistsCarousel } from '@/components/main-screen/playlists-carousel'
import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { useColors } from '@/hooks/colors'
import React from 'react'
import Animated from 'react-native-reanimated'

export default function Screen() {
  return <NavBarContainer title='7dAH App' ScrollComponent={ScrollComponent} />
}

function ScrollComponent(props: ScrollComponentProps) {
  const colors = useColors()

  return (
    <Animated.ScrollView
      contentContainerStyle={[
        props.style,
        {
          backgroundColor: colors.background,
          paddingBottom: 128,
          gap: 16,
        },
      ]}
      onScroll={props.scrollHandler}
      scrollEventThrottle={16}>
      <HistoryCarousel />
      <CategoriesCarousel />
      <FavoritesCarousel />
      <PlaylistsCarousel />
    </Animated.ScrollView>
  )
}
