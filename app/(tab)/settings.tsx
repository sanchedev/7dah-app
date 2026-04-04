import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { Icon } from '@/components/ui/icon'
import { ListItem, ListItemProps } from '@/components/ui/list-item'
import { Notifications } from '@/lib/notifications/notifications'
import { router } from 'expo-router'
import Animated from 'react-native-reanimated'

export default function Settings() {
  return <NavBarContainer title='Ajustes' ScrollComponent={ScrollComponent} />
}

function ScrollComponent(props: ScrollComponentProps) {
  return (
    <Animated.FlatList<ListItemProps>
      contentContainerStyle={[props.style]}
      onScroll={props.scrollHandler}
      data={[
        {
          leadingComp: () => <Icon name='tune' />,
          title: 'Preferencias',
          onPress: () => router.navigate('/settings/preferences'),
        },
        {
          leadingComp: () => <Icon name='notifications' />,
          title: 'Notificaciones',
          onPress: () =>
            Notifications.requestPermissions().then(
              (granted) =>
                granted && router.navigate('/settings/notifications'),
            ),
        },
        {
          leadingComp: () => <Icon name='info' />,
          title: 'Acerca de',
          onPress: () => router.navigate('/settings/about'),
        },
      ]}
      keyExtractor={({ title }) => title}
      renderItem={({ item }) => <ListItem {...item} />}
    />
  )
}
