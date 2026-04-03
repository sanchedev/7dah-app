import { HymnList } from '@/components/hymn/hymn-list'
import { IconButton } from '@/components/ui/icon-button'
import { useColors } from '@/hooks/colors'
import { Hymns } from '@/lib/hymns/hymns'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const NAV_HEIGHT = 72

export default function SearchScreen() {
  const { top, bottom } = useSafeAreaInsets()
  const navHeight = NAV_HEIGHT + top

  const colors = useColors()
  const router = useRouter()

  const [filteredHymns, setFilteredHymns] = useState(Hymns.getAllIds())
  const [search, setSearch] = useState('')

  useEffect(() => {
    setFilteredHymns(Hymns.search(search))
  }, [search])

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HymnList
        hymnsIds={filteredHymns}
        contentContainerStyle={{
          paddingTop: navHeight + 16,
          paddingBottom: bottom,
        }}
        scrollEventThrottle={16}
      />

      <View
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
        <View
          style={[
            {
              ...StyleSheet.absoluteFill,
              backgroundColor: colors.background + 'ee',
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
            autoFocus
            keyboardType='default'
            style={{ color: colors.foreground, flex: 1 }}
            placeholderTextColor={colors.foreground + '88'}
            onChangeText={setSearch}
          />
        </View>
      </View>
    </View>
  )
}
