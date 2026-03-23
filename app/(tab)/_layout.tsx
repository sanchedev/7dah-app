import { UiText } from '@/components/ui/text'
import { useColors } from '@/hooks/colors'
import { MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  const colors = useColors()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.text + '22',
        },
        tabBarLabelStyle: {
          color: colors.text,
        },
        tabBarIconStyle: {
          color: colors.text,
        },
        headerShown: false,
        tabBarLabel({ focused, children }) {
          return (
            <UiText
              style={{
                fontSize: 12,
                color: colors.text + (focused ? 'ff' : 88),
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
              color={colors.text + (focused ? 'ff' : 88)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              size={28}
              name='favorite'
              color={colors.text + (focused ? 'ff' : 88)}
            />
          ),
        }}
      />
    </Tabs>
  )
}
