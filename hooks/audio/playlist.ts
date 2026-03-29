import { Playlists } from '@/lib/audio/playlists'
import { Playlist } from '@/lib/audio/types'
import { useEffect, useState } from 'react'

export function usePlaylist(playlistId: string | null) {
  const [playlist, setPlaylist] = useState(
    playlistId != null ? (Playlists.get(playlistId) ?? null) : null,
  )

  useEffect(() => {
    if ((playlist?.id ?? null) === playlistId) {
      setPlaylist(
        playlistId != null ? (Playlists.get(playlistId) ?? null) : null,
      )
    }

    const handleEdit = (p: Playlist | undefined) => {
      setPlaylist(playlist ?? null)
    }

    Playlists.playlistEdited.on(handleEdit)
    return () => {
      Playlists.playlistEdited.off(handleEdit)
    }
  }, [playlistId])

  return playlist
}
