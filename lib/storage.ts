import AsyncStorage from '@react-native-async-storage/async-storage'
import * as z from 'zod'
import { Playlist } from './audio/types'
import { hymns } from './hymns'

const KEYS = {
  FAVORITES: 'favorites',
  PLAYLISTS: 'playlists',
  HISTORY: 'history',
}

const favoritesSchema = z.array(z.number().int().min(0).max(613))

export async function saveFavorites(favorites: number[]): Promise<number[]> {
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites))
  return favorites
}

export async function getFavorites(): Promise<number[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITES)
    const { data: favorites } = await favoritesSchema.safeParseAsync(
      JSON.parse(data ?? ''),
    )
    return favorites ?? []
  } catch {
    return []
  }
}

const playlistsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    visualId: z.string(),
    hymns: z.array(z.number().int().min(0).max(613)),
  }),
)

export async function savePlaylists(playlists: Playlist[]) {
  await AsyncStorage.setItem(
    KEYS.PLAYLISTS,
    JSON.stringify(
      playlists.map((p) => ({
        id: p.id,
        name: p.name,
        visualId: p.visualId,
        hymns: p.hymns.map((h) => h.number),
      })),
    ),
  )
}

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PLAYLISTS)
    const { data: playlists } = await playlistsSchema.safeParseAsync(
      JSON.parse(data ?? ''),
    )
    return (playlists ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      visualId: p.visualId,
      hymns: p.hymns.map((h) => hymns[h - 1]),
    }))
  } catch {
    return []
  }
}

const historySchema = z.array(z.number().int().min(0).max(613))

export async function saveHistory(history: number[]): Promise<number[]> {
  await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history))
  return history
}

export async function getHistory(): Promise<number[]> {
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
