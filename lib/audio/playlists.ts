import { randomUUID } from 'expo-crypto'
import { Signal } from '../signal'
import { getPlaylists, savePlaylists } from '../storage'
import { Hymn } from '../types'
import { Playlist } from './types'

type PlaylistCreateOptions = Omit<Playlist, 'id'>
type PlaylistUpdateOptions = Partial<Omit<Playlist, 'id'>>

const playlists = new Map<string, Playlist>()

export class Playlists {
  static playlistsChanged = new Signal<[playlists: Playlist[]]>()
  static playlistEdited = new Signal<[playlist: Playlist | undefined]>()

  static #change() {
    const newPlaylists = [...playlists.values()]
    this.playlistsChanged.emit(newPlaylists)
    savePlaylists(newPlaylists)
  }

  static get(id: string): Playlist | undefined {
    return playlists.get(id)
  }

  static add(playlist: PlaylistCreateOptions): Playlist {
    const id = randomUUID()

    const newPlaylist: Playlist = {
      ...playlist,
      id,
    }

    playlists.set(id, newPlaylist)

    this.playlistEdited.emit(newPlaylist)
    this.#change()

    return newPlaylist
  }

  static edit(
    id: string,
    playlist: PlaylistUpdateOptions,
  ): Playlist | undefined {
    const oldPlaylist = playlists.get(id)

    if (oldPlaylist == null) return

    const newPlaylist: Playlist = {
      ...oldPlaylist,
      ...playlist,
      id,
    }

    playlists.set(id, newPlaylist)

    this.playlistEdited.emit(newPlaylist)
    this.#change()

    return newPlaylist
  }

  static delete(id: string): boolean {
    if (!playlists.has(id)) return false
    const hasDeleted = playlists.delete(id)

    this.playlistEdited.emit(undefined)
    this.#change()

    return hasDeleted
  }

  static addHymn(id: string, hymn: Hymn, index?: number) {
    const hymns = this.get(id)?.hymns

    if (hymns == null) return

    const newHymns = hymns.filter((h) => h.number === hymn.number)

    if (index == null) {
      newHymns.push(hymn)
    } else {
      newHymns.splice(index, 0, hymn)
    }

    this.edit(id, {
      hymns: newHymns,
    })
  }

  static getAll(): Playlist[] {
    return [...playlists.values()]
  }

  static async setup() {
    playlists.clear()

    const playlistsArray = await getPlaylists()

    for (const p of playlistsArray) {
      playlists.set(p.id, p)
    }

    this.#change()
  }
}
