import AsyncStorage from '@react-native-async-storage/async-storage'
import * as z from 'zod'
import { Hymns } from './hymns/hymns'

const KEYS = {
  FAVORITES: 'favorites',
  PLAYLISTS: 'playlists',
  HISTORY: 'history',
}

const hymnIdSchema = z.string().refine(async (str) => Hymns.has(str))

type PlaylistsType = z.infer<typeof playlistsSchema>
const playlistsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    visualId: z.string(),
    hymns: z.array(hymnIdSchema),
  }),
)

export async function savePlaylists(playlists: PlaylistsType) {
  await AsyncStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists))
}

export async function getPlaylists(): Promise<PlaylistsType> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PLAYLISTS)
    const { data: playlists } = await playlistsSchema.safeParseAsync(
      JSON.parse(data ?? ''),
    )
    const p = playlists ?? []

    if (p.every((pl) => pl.id !== 'favorites')) {
      p.unshift({
        id: 'favorites',
        name: 'Favoritos',
        visualId: '30',
        hymns: [],
      })
    }

    return p
  } catch {
    return []
  }
}

type HistoryType = z.infer<typeof historySchema>
const historySchema = z.array(hymnIdSchema)

export async function saveHistory(history: HistoryType) {
  await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history))
}

export async function getHistory(): Promise<HistoryType> {
  try {
    const data = await AsyncStorage.getItem(KEYS.HISTORY)
    const { data: history } = await historySchema.safeParseAsync(
      JSON.parse(data ?? ''),
    )
    return history ?? []
  } catch {
    return []
  }
}
