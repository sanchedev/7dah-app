import HymnPage from '@/components/hymn-page'
import { useColors } from '@/hooks/colors'
import { hymns } from '@/lib/hymns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'

const regex = /^\d{3}$/

export default function HymnScreen() {
  const colors = useColors()
  const { hymn } = useLocalSearchParams()

  const router = useRouter()

  if (typeof hymn !== 'string') {
    router.replace('/')
    return null
  }
  if (!regex.test(hymn)) {
    router.replace('/')
    return null
  }

  const hymnObj = hymns[Number(hymn) - 1]

  if (hymnObj == null) {
    router.replace('/')
    return null
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HymnPage hymn={hymnObj} />
    </View>
  )
}
