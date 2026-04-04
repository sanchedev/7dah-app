import {
  NavBarContainer,
  ScrollComponentProps,
} from '@/components/nav-bar-container'
import { Icon } from '@/components/ui/icon'
import { IconButton } from '@/components/ui/icon-button'
import { ListItem, ListItemProps } from '@/components/ui/list-item'
import { useLoop, useShuffle } from '@/hooks/audio/audio-controllers'
import { Preferences } from '@/lib/preferences/preferences'
import { router } from 'expo-router'
import { Switch } from 'react-native'
import Animated from 'react-native-reanimated'

export default function PreferencesSettings() {
  return (
    <NavBarContainer
      title='Preferencias'
      ScrollComponent={ScrollComponent}
      trailingComponent={() => (
        <IconButton iconName='arrow-back' onPress={() => router.back()} />
      )}
    />
  )
}

function ScrollComponent(props: ScrollComponentProps) {
  const loop = useLoop()
  const setLoop = (loop: boolean) => {
    Preferences.toggleLoop(loop)
  }

  const shuffle = useShuffle()
  const setShuffle = (shuffle: boolean) => {
    Preferences.toggleShuffle(shuffle)
  }

  return (
    <Animated.FlatList<ListItemProps>
      contentContainerStyle={[props.style]}
      onScroll={props.scrollHandler}
      data={[
        {
          leadingComp: () => <Icon name='repeat' />,
          title: 'Bucle ' + (loop ? 'activado' : 'desactivado'),
          trailingComp: () => <Switch value={loop} onValueChange={setLoop} />,
        },
        {
          leadingComp: () => <Icon name='shuffle' />,
          title: 'Aleatorio ' + (shuffle ? 'activado' : 'desactivado'),
          trailingComp: () => (
            <Switch value={shuffle} onValueChange={setShuffle} />
          ),
        },
      ]}
      keyExtractor={({ title }) => title}
      renderItem={({ item }) => <ListItem {...item} />}
    />
  )
}
