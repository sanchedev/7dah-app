import { AudioControllers } from '@/lib/audio/audio-controllers'
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
  const [loop] = useSignalState(
    AudioControllers.loopChanged,
    AudioControllers.isLoop(),
  )

  return loop
}

export function useShuffle() {
  const [shuffle] = useSignalState(
    AudioControllers.shuffleChanged,
    AudioControllers.isShuffle(),
  )

  return shuffle
}
