import { Playlists } from '@/lib/audio/playlists'
import { useSignalState } from '../signal'

export function usePlaylists() {
  const [playlists] = useSignalState(
    Playlists.playlistsChanged,
    Playlists.getAll(),
  )

  return playlists
}
