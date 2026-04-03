import { setAudioModeAsync } from 'expo-audio'
import { AudioControllers } from './audio-controllers'
import { PlayerManager } from './audio-player'
import { Current } from './current'
import { History } from './history'
import { Playlists } from './playlists'

export async function setupPlayer() {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'doNotMix',
  })

  await Playlists.setup()

  await Promise.all([History.setup(), AudioControllers.setup()])

  PlayerManager.playerCreated.on(() => {
    Current.reset()
    AudioControllers.setup()
  })
}
