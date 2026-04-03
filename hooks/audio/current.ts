import { Current, CurrentInfo } from '@/lib/audio/current'
import { useEffect, useState } from 'react'
import { useSignalState } from '../signal'

export function useCurrent() {
  const [index, hymnId] = useSignalState(
    Current.indexChanged,
    Current.getIndex(),
    Current.getHymnId(),
  )
  const [playlist] = useSignalState(
    Current.playlistChanged,
    Current.getPlaylist(),
    Current.getHymnList(),
  )

  return {
    index,
    hymnId,
    playlistId: playlist?.id ?? null,
    playlist,
  }
}

export function useIsCurrent(info?: CurrentInfo) {
  const [isCurrent, setIsCurrent] = useState(
    info == null ? true : Current.isCurrent(info),
  )

  useEffect(() => {
    if (info == null) return

    const handleChange = () => {
      setIsCurrent(Current.isCurrent(info))
    }

    Current.indexChanged.on(handleChange)
    Current.playlistChanged.on(handleChange)

    return () => {
      Current.indexChanged.on(handleChange)
      Current.playlistChanged.on(handleChange)
    }
  }, [info])

  return isCurrent
}
