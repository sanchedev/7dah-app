import { Categories } from '@/lib/categories/categories'
import { Category } from '@/lib/categories/type'
import { useEffect, useState } from 'react'

export function useCategory(id: string | undefined) {
  const [category, setCategory] = useState<Category>()

  useEffect(() => {
    if (id == null) return
    Categories.get(id).then(setCategory)
  }, [id])

  return category
}
