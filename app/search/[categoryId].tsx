import { CategoryView } from '@/components/category/category-view'
import { useCategory } from '@/hooks/categories/category'
import { useColors } from '@/hooks/colors'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams()
  const colors = useColors()

  const category = useCategory(
    typeof categoryId !== 'string' ? undefined : categoryId,
  )

  if (category == null) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />
  }

  return <CategoryView category={category} />
}
