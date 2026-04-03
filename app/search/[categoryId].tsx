import { CategoryView } from '@/components/category/category-view'
import { Categories } from '@/lib/categories/categories'
import { router, useLocalSearchParams } from 'expo-router'

export default function CategoryScreen() {
  const { categoryId } = useLocalSearchParams()

  if (typeof categoryId !== 'string') {
    router.replace('/')
    return null
  }

  const category = Categories.get(categoryId)

  if (category == null) {
    router.replace('/')
    return null
  }

  return <CategoryView category={category} />
}
