import { AudioControllers } from '@/lib/audio/audio-controllers'
import { Preferences } from '@/lib/preferences/preferences'
import { useSignalState } from '../signal'

export function usePlaying() {
  const [playing] = useSignalState(
    AudioControllers.playStateChanged,
    AudioControllers.isPlaying(),
  )

  return playing
}

export function useCurrentTime() {
  const [currentTime] = useSignalState(
    AudioControllers.currentTimeChanged,
    AudioControllers.getCurrentTime(),
  )

  return currentTime
}

export function useLoop() {
  const [loop] = useSignalState(Preferences.loopChanged, Preferences.getLoop())

  return loop
}

export function useShuffle() {
  const [shuffle] = useSignalState(
    Preferences.shuffleChanged,
    Preferences.getShuffle(),
  )

  return shuffle
}
