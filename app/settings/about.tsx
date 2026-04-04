import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { Icon } from '@/components/ui/icon'
import { IconButton } from '@/components/ui/icon-button'
import { ListItem, ListItemProps } from '@/components/ui/list-item'
import { router } from 'expo-router'
import Animated from 'react-native-reanimated'

export default function PreferencesSettings() {
  return (
    <NavBarContainer
      title='Acerca de'
      ScrollComponent={ScrollComponent}
      trailingComponent={() => (
        <IconButton iconName='arrow-back' onPress={() => router.back()} />
      )}
    />
  )
}

function ScrollComponent(props: ScrollComponentProps) {
  return (
    <Animated.FlatList<ListItemProps>
      contentContainerStyle={[props.style]}
      onScroll={props.scrollHandler}
      data={[
        {
          leadingComp: () => <Icon name='code' />,
          title: 'Versión 1.3.0',
        },
      ]}
      keyExtractor={({ title }) => title}
      renderItem={({ item }) => <ListItem {...item} />}
    />
  )
}
