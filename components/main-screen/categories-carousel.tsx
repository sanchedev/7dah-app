import { Categories } from '@/lib/categories/categories'
import { CategoryJson } from '@/lib/categories/type'
import { router } from 'expo-router'
import { View } from 'react-native'
import { Carousel } from '../ui/carousel/carousel'
import { IconButton } from '../ui/icon-button'
import { UiText } from '../ui/text'
import { VisualCard } from '../visuals/visual-card'

export function CategoriesCarousel() {
  const categories = Categories.getAll()

  return (
    <>
      <View style={{ width: '100%', flexDirection: 'row', gap: 16 }}>
        <UiText style={{ marginBottom: 4, flex: 1 }} variant={'subtitle'}>
          Categorías
        </UiText>
        <IconButton
          iconName='chevron-right'
          onPress={() => router.navigate('/search')}
        />
      </View>
      <Carousel
        data={categories.map((cat) => ({ id: cat.id, props: cat }))}
        cardComponent={(cat: CategoryJson) => (
          <VisualCard
            visualId={cat.visualId}
            title={cat.title}
            subtitle={cat.description || 'Categoría'}
            onPress={() =>
              router.push({
                pathname: '/search/[categoryId]',
                params: {
                  categoryId: cat.id,
                },
              })
            }
          />
        )}
      />
    </>
  )
}
