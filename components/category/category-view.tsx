import { Category } from '@/lib/categories/type'
import { router } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import VisualBackground from '../hymn/hymn-background'
import { HymnItem } from '../hymn/hymn-item'
import { IconButton } from '../ui/icon-button'
import { UiText } from '../ui/text'

interface CategoryViewProps {
  category: Category
}

export function CategoryView({ category }: CategoryViewProps) {
  const insets = useSafeAreaInsets()

  return (
    <VisualBackground visualId={category.visual.id}>
      <ScrollView
        style={{
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        }}>
        <View
          style={{
            height: insets.top + 56,
            paddingTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton iconName='arrow-back' onPress={() => router.back()} />
          <UiText variant='subtitle'>Categorias</UiText>
        </View>
        <View style={{ flex: 1 }}>
          <UiText
            variant='subtitle'
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{
              marginVertical: 8,
            }}>
            {category.title}
          </UiText>

          {category.description && (
            <UiText style={{ opacity: 0.5 }}>{category.description}</UiText>
          )}
        </View>
        {category.hymns.map((hymnId) => (
          <HymnItem key={category.id + hymnId} hymnId={hymnId} />
        ))}
        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </VisualBackground>
  )
}
