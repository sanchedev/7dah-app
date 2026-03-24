import { setAudioModeAsync } from 'expo-audio'
import { AudioManager } from './audio-manager'
// import { playbackService } from '../service'

export async function setupPlayer() {
  setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'doNotMix',
  })
  await AudioManager.setup()
}
// TrackPlayer.registerPlaybackService(() => playbackService)
