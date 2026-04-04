import { setAudioModeAsync } from 'expo-audio'
import { AudioControllers } from './audio/audio-controllers'
import { PlayerManager } from './audio/audio-player'
import { Current } from './audio/current'
import { History } from './audio/history'
import { Playlists } from './audio/playlists'
import { Notifications } from './notifications/notifications'
import { Preferences } from './preferences/preferences'

export async function setupPlayer() {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'doNotMix',
  })

  await Playlists.setup()

  await Promise.all([
    History.setup(),
    AudioControllers.setup(),
    Notifications.setup(),
    Preferences.setup(),
  ])

  PlayerManager.playerCreated.on(() => {
    Current.reset()
    AudioControllers.setup()
  })
}
