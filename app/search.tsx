import { HymnList } from '@/components/hymn/hymn-list'
import { IconButton } from '@/components/ui/icon-button'
import { useColors } from '@/hooks/colors'
import { hymns } from '@/lib/hymns'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const NAV_HEIGHT = 72

export default function SearchScreen() {
  const { top, bottom } = useSafeAreaInsets()
  const navHeight = NAV_HEIGHT + top

  const scrollY = useSharedValue(0)

  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y
      scrollY.value = y
    },
  })

  const colors = useColors()
  const router = useRouter()

  const [filteredHymns, setFilteredHymns] = useState(hymns)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setFilteredHymns(
      hymns.filter(
        (hymn) =>
          hymn.number.toString().includes(search) ||
          hymn.title.toLowerCase().includes(search.toLowerCase()),
      ),
    )
  }, [search])

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HymnList
        hymns={filteredHymns}
        contentContainerStyle={{
          paddingTop: navHeight + 16,
          paddingBottom: bottom,
        }}
        onScroll={handler}
        scrollEventThrottle={16}
      />

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: navHeight,
            paddingTop: top,
            justifyContent: 'center',
            paddingHorizontal: 16,
          },
        ]}>
        <Animated.View style={[{ ...StyleSheet.absoluteFillObject }]}>
          <BlurView intensity={75} tint={colors.theme} style={{ flex: 1 }} />
        </Animated.View>
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: colors.background + '44',
            },
          ]}
        />
        <View
          style={[
            {
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            },
          ]}>
          <IconButton iconName='arrow-back' onPress={() => router.back()} />
          <TextInput
            placeholder='Buscar...'
            style={{ color: colors.text, flex: 1 }}
            placeholderTextColor={colors.text + '88'}
            onChangeText={setSearch}
          />
        </View>
      </Animated.View>
    </View>
  )
}
