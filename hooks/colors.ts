import { Colors } from '@/constants/theme'
import { useColorScheme } from 'react-native'

export function useColors() {
  const colorScheme = useColorScheme()
  const color = colorScheme === 'unspecified' ? 'light' : colorScheme
  return { ...Colors[color], theme: color }
}
