import { useColors } from '@/hooks/colors'
import { setupPlayer } from '@/lib/setup'
import { BottomSheetProvider } from '@/providers/bottom-sheet'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [ready, setReady] = useState(false)

  const [loaded] = useFonts({
    Rosario: require('../assets/fonts/Rosario-Regular.ttf'),
    RosarioBold: require('../assets/fonts/Rosario-Bold.ttf'),
  })

  useEffect(() => {
    setupPlayer().then(() => setReady(true))
  }, [])

  useEffect(() => {
    if (ready && loaded) {
      SplashScreen.hide()
    }
  }, [ready, loaded])

  const colors = useColors()

  if (!ready || !loaded) return null

  return (
    <GestureHandlerRootView>
      <BottomSheetProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(tab)' options={{ headerShown: false }} />
        </Stack>
        <StatusBar
          style={colors.theme === 'dark' ? 'light' : 'dark'}
          animated
        />
      </BottomSheetProvider>
    </GestureHandlerRootView>
  )
}
