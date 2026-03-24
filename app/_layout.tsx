import { setupPlayer } from '@/lib/audio/setup'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'

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

  if (!ready || !loaded) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tab)' options={{ headerShown: false }} />
    </Stack>
  )
}
