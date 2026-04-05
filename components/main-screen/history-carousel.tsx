import { useHistory } from '@/hooks/audio/history'
import { router } from 'expo-router'
import { HymnCarousel } from '../hymn/hymns-carousel'
import { Icon } from '../ui/icon'
import { ItemSeparator, ListItem } from '../ui/list-item'
import { UiText } from '../ui/text'

export function HistoryCarousel() {
  const history = useHistory()

  if (history.length === 0)
    return (
      <>
        <ListItem
          leadingComp={() => <Icon name='emoji-people' />}
          title='¡Bienvenido!'
          subtitle='¿Qué tal si empezamos a navegar?'
          onPress={() => router.push('/search/specific')}
        />
        <ItemSeparator />
      </>
    )

  return (
    <>
      <UiText style={{ marginBottom: 4 }} variant={'subtitle'}>
        Recientes
      </UiText>
      <HymnCarousel data={history.map((hymnId) => ({ hymnId }))} />
    </>
  )
}
