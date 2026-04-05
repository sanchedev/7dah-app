import { CategoryCard } from '@/components/category/category-card'
import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { IconButton } from '@/components/ui/icon-button'
import { Categories } from '@/lib/categories/categories'
import { router } from 'expo-router'
import React, { Fragment } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'

export default function Screen() {
  return (
    <NavBarContainer
      title='Buscar'
      ScrollComponent={ScrollComponent}
      leadingComponent={ActionComponent}
    />
  )
}

function ScrollComponent(props: ScrollComponentProps) {
  const categories = Categories.getAll()
  const size = useWindowDimensions()

  const countPerRow = Math.floor(size.width / 192)
  const sliced = Array.from(
    { length: Math.ceil(categories.length / countPerRow) },
    (_, i) => {
      return Array.from(
        { length: countPerRow },
        (_, j) => categories[i * countPerRow + j],
      )
    },
  )

  return (
    <Animated.ScrollView
      contentContainerStyle={[
        props.style,
        {
          gap: 16,
        },
      ]}
      onScroll={props.scrollHandler}
      scrollEventThrottle={16}>
      {sliced.map((cats) => (
        <View
          key={cats[0].id + 'container'}
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
          {cats.map((cat) => (
            <Fragment key={cat.id + 'nested'}>
              {cat == null ? (
                <View style={{ flex: 1 }} />
              ) : (
                <CategoryCard category={cat} />
              )}
            </Fragment>
          ))}
        </View>
      ))}
    </Animated.ScrollView>
  )
}

function ActionComponent() {
  return (
    <IconButton
      iconName='search'
      onPress={() => router.push('/search/specific')}
    />
  )
}
