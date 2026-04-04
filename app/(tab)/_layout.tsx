import { HymnPlaying } from '@/components/hymn/hymn-playing'
import { UiText } from '@/components/ui/text'
import { useColors } from '@/hooks/colors'
import { MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  const colors = useColors()

  return (
    <>
      <HymnPlaying />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'blue',
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.foreground + '22',
          },
          tabBarLabelStyle: {
            color: colors.foreground,
          },
          tabBarIconStyle: {
            color: colors.foreground,
          },
          headerShown: false,
          tabBarLabel({ focused, children }) {
            return (
              <UiText
                style={{
                  fontSize: 12,
                  color: colors.foreground + (focused ? 'ff' : 88),
                  fontWeight: focused ? 700 : 400,
                }}>
                {children}
              </UiText>
            )
          },
        }}>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Principal',
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                size={28}
                name='home-filled'
                color={colors.foreground + (focused ? 'ff' : 88)}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='search'
          options={{
            title: 'Buscar',
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                size={28}
                name='search'
                color={colors.foreground + (focused ? 'ff' : 88)}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='lists'
          options={{
            title: 'Listas',
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                size={28}
                name='list'
                color={colors.foreground + (focused ? 'ff' : 88)}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='settings'
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                size={28}
                name='settings'
                color={colors.foreground + (focused ? 'ff' : 88)}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
