import { Current, CurrentInfo } from '@/lib/audio/current'
import { useEffect, useState } from 'react'
import { useSignalState } from '../signal'

export function useCurrent() {
  const [index, playlistId] = useSignalState(
    Current.currentChanged,
    Current.getIndex(),
    Current.getPlaylistId(),
  )

  const [hymnId, setHymnId] = useState(() => Current.getHymnId())
  const [playlist, setPlaylist] = useState(() => Current.getPlaylist())

  useEffect(() => {
    const handleChange = () => {
      setHymnId(Current.getHymnId())
      setPlaylist(Current.getPlaylist())
    }

    Current.currentChanged.on(handleChange)

    return () => {
      Current.currentChanged.off(handleChange)
    }
  }, [])

  return {
    index,
    hymnId,
    playlistId,
    playlist,
  }
}

export function useIsCurrent(info?: CurrentInfo) {
  const [isCurrent, setIsCurrent] = useState(
    info == null ? true : Current.isCurrent(info),
  )

  useEffect(() => {
    if (info == null) return

    setIsCurrent(Current.isCurrent(info))

    const handleChange = () => {
      setIsCurrent(Current.isCurrent(info))
    }

    Current.currentChanged.on(handleChange)

    return () => {
      Current.currentChanged.off(handleChange)
    }
  }, [info])

  return isCurrent
}
