import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { IconButton } from '@/components/ui/icon-button'
import { ListItem, ListItemProps } from '@/components/ui/list-item'
import { VisualImage } from '@/components/visuals/visual'
import { useNotifications } from '@/hooks/notifications/notification'
import { notificationLists } from '@/lib/notifications/lists'
import { Notifications } from '@/lib/notifications/notifications'
import { Visuals } from '@/lib/visuals/visuals'
import { router } from 'expo-router'
import { Switch } from 'react-native'
import Animated from 'react-native-reanimated'

export default function PreferencesSettings() {
  return (
    <NavBarContainer
      title='Notificaciones'
      ScrollComponent={ScrollComponent}
      trailingComponent={() => (
        <IconButton iconName='arrow-back' onPress={() => router.back()} />
      )}
    />
  )
}

function ScrollComponent(props: ScrollComponentProps) {
  const notifications = useNotifications()

  const handleToggleNotification =
    (notificationId: string) => (active: boolean) => {
      const item = notificationLists.find((n) => n.id === notificationId)
      if (item == null) return

      const notif = notifications.find((n) => n.listId === notificationId)
      if (active) {
        if (notif != null) return
        Notifications.registryNotification(item)
      } else {
        if (notif == null) return
        Notifications.cancelNotification(notif.notificationId)
      }
    }

  return (
    <Animated.FlatList<ListItemProps>
      contentContainerStyle={[props.style]}
      onScroll={props.scrollHandler}
      data={[
        ...notificationLists.map<ListItemProps>((n) => ({
          leadingComp: n.path.startsWith('/hymns/')
            ? () => {
                return (
                  <VisualImage
                    style={{ flex: 1, aspectRatio: 1, borderRadius: 8 }}
                    visualId={Visuals.getIdFromHymnId(n.path.slice(7, 11))}
                  />
                )
              }
            : undefined,
          title: n.title,
          subtitle: n.body,
          trailingComp: () => (
            <Switch
              value={notifications.some(({ listId }) => listId === n.id)}
              onValueChange={handleToggleNotification(n.id)}
            />
          ),
        })),
      ]}
      keyExtractor={({ title }) => title}
      renderItem={({ item }) => <ListItem {...item} />}
    />
  )
}
