import { randomUUID } from 'expo-crypto'
import { Signal } from '../signal'
import { getPlaylists, savePlaylists } from '../storage'
import { Playlist } from './types'

type PlaylistCreateOptions = Omit<Playlist, 'id'>
type PlaylistUpdateOptions = Partial<Omit<Playlist, 'id'>>

const playlists = new Map<string, Playlist>()

export class Playlists {
  static playlistsChanged = new Signal<[playlists: Playlist[]]>()
  static playlistEdited = new Signal<[playlist: Playlist | undefined]>()

  static #change() {
    const p = [...playlists.values()]
    savePlaylists(p)

    const pc = p.filter((p) => p.id !== 'favorites')
    this.playlistsChanged.emit(pc)
  }

  static _addFavorites() {
    const newPlaylist: Playlist = {
      id: 'favorites',
      name: 'Favoritos',
      visualId: '30',
      hymns: [],
    }
    playlists.set(newPlaylist.id, newPlaylist)
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

  static addHymn(id: string, hymnId: string, index?: number) {
    const hymns = this.get(id)?.hymns

    if (hymns == null) return false

    const newHymns = hymns.filter((h) => h !== hymnId)

    if (index == null) {
      newHymns.push(hymnId)
    } else {
      newHymns.splice(index, 0, hymnId)
    }

    this.edit(id, {
      hymns: newHymns,
    })

    return true
  }
  static removeHymn(id: string, hymnId: string) {
    const hymns = this.get(id)?.hymns

    if (hymns == null) return false

    const newHymns = hymns.filter((h) => h !== hymnId)

    this.edit(id, {
      hymns: newHymns,
    })

    return true
  }

  static getAll(): Playlist[] {
    return [...playlists.values()].filter((p) => p.id !== 'favorites')
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
