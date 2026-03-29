import { HymnItem } from '@/components/hymn/hymn-item'
import { HymnCarousel } from '@/components/hymn/hymns-carousel'
import { NavBarContainer } from '@/components/nav-bar-container'
import { IconButton } from '@/components/ui/icon-button'
import { UiText } from '@/components/ui/text'
import { useHistory } from '@/hooks/audio/history'
import { useColors } from '@/hooks/colors'
import { hymns } from '@/lib/hymns'
import { useRouter } from 'expo-router'
import React, { Fragment } from 'react'
import { View } from 'react-native'
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated'

export default function Screen() {
  return (
    <NavBarContainer
      title='7dAH App'
      ScrollComponent={ScrollComponent}
      ActionComponent={ActionComponent}
    />
  )
}

function ScrollComponent(props: {
  paddingTop: number
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>
}) {
  const colors = useColors()
  const history = useHistory()

  return (
    <Animated.ScrollView
      contentContainerStyle={{
        paddingTop: props.paddingTop,
        backgroundColor: colors.background,
      }}
      onScroll={props.scrollHandler}
      scrollEventThrottle={16}>
      {history.length > 0 && (
        <>
          <UiText
            style={{ marginHorizontal: 16, marginBottom: 4 }}
            variant='subtitle'>
            Escuchados Recientemente
          </UiText>
          <HymnCarousel
            hymns={history.toReversed().map((h) => hymns[h - 1])}
            style={{ marginBottom: 16 }}
          />
        </>
      )}
      <UiText
        style={{ marginHorizontal: 16, marginBottom: 4 }}
        variant='subtitle'>
        Algunos Himnos
      </UiText>
      {hymns.slice(0, 40).map((hymn, index) => (
        <Fragment key={`Hymn-${hymn.number}`}>
          {index !== 0 && (
            <View
              style={{
                backgroundColor: colors.foreground,
                opacity: 0.1,
                width: '100%',
                height: 1,
                marginHorizontal: 8,
              }}
            />
          )}
          <HymnItem hymn={hymn} />
        </Fragment>
      ))}
    </Animated.ScrollView>
  )
}

function ActionComponent() {
  const router = useRouter()

  return <IconButton iconName='search' onPress={() => router.push('/search')} />
}
