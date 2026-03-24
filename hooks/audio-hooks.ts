import { AudioManager } from '@/lib/audio/audio-manager'
import { Hymn } from '@/lib/types'
import { useEffect, useState } from 'react'

export function useAudioQueue() {
  const [queue, setQueue] = useState(AudioManager.getQueue())

  useEffect(() => {
    AudioManager.addEventListener('queueChange', setQueue)
    return () => {
      AudioManager.removeEventListener('queueChange', setQueue)
    }
  }, [])

  return queue
}

export function useAudioCurrent() {
  const [current, setCurrent] = useState(AudioManager.getCurrentIndex())
  const queue = useAudioQueue()

  useEffect(() => {
    AudioManager.addEventListener('indexChange', setCurrent)
    return () => {
      AudioManager.removeEventListener('indexChange', setCurrent)
    }
  }, [])

  return {
    index: current,
    hymn: queue[current] as Hymn | undefined,
  }
}

export function useAudioCurrentPlaylist() {
  const [playlist, setPlaylist] = useState(AudioManager.getCurrentPlaylistId())

  useEffect(() => {
    AudioManager.addEventListener('playlistChange', setPlaylist)
    return () => {
      AudioManager.removeEventListener('playlistChange', setPlaylist)
    }
  }, [])

  return playlist
}

export function useAudioPlaying() {
  const [playing, setPlaying] = useState(AudioManager.isPlaying())

  useEffect(() => {
    AudioManager.addEventListener('playStatusChange', setPlaying)
    return () => {
      AudioManager.removeEventListener('playStatusChange', setPlaying)
    }
  }, [])

  return playing
}

export function useAudioProgress() {
  const [progress, setProgress] = useState(AudioManager.getProgress())

  useEffect(() => {
    AudioManager.addEventListener('progressChange', setProgress)
    return () => {
      AudioManager.removeEventListener('progressChange', setProgress)
    }
  }, [])

  return progress
}

export function useAudioLoop() {
  const [loop, setLoop] = useState(AudioManager.isLoop())

  useEffect(() => {
    AudioManager.addEventListener('loopChange', setLoop)
    return () => {
      AudioManager.removeEventListener('loopChange', setLoop)
    }
  }, [])

  return loop
}

export function useAudioShuffle() {
  const [shuffle, setShuffle] = useState(AudioManager.isShuffle())

  useEffect(() => {
    AudioManager.addEventListener('shuffleChange', setShuffle)
    return () => {
      AudioManager.removeEventListener('shuffleChange', setShuffle)
    }
  }, [])

  return shuffle
}

export function useAudioFavorites() {
  const [favorites, setFavorites] = useState(AudioManager.getFavorites())

  useEffect(() => {
    AudioManager.addEventListener('favoritesChange', setFavorites)
    return () => {
      AudioManager.removeEventListener('favoritesChange', setFavorites)
    }
  }, [])

  return favorites
}
export function useAudioHistory() {
  const [history, setHistory] = useState(AudioManager.getHistory())

  useEffect(() => {
    AudioManager.addEventListener('historyChange', setHistory)
    return () => {
      AudioManager.removeEventListener('historyChange', setHistory)
    }
  }, [])

  return history
}
