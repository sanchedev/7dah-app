import { Signal } from '../signal'
import { Playlists } from './playlists'

export class Favorites {
  static favoritesChanged = new Signal<[favorites: string[]]>()

  static #getHymns() {
    const hymns = Playlists.get('favorites')?.hymns
    if (hymns != null) return hymns
    Playlists._addFavorites()
    return []
  }

  static #change() {
    // const fav = this.get()
    // this.favoritesChanged.emit(fav)
  }

  static get(): string[] {
    return this.#getHymns()
  }

  static add(hymnId: string): boolean {
    if (this.get().includes(hymnId)) return false
    const wasAdded = Playlists.addHymn('favorites', hymnId)
    this.#change()
    return wasAdded
  }

  static delete(hymnId: string): boolean {
    if (!this.get().includes(hymnId)) return false
    const wasDeleted = Playlists.removeHymn('favorites', hymnId)

    this.#change()

    return wasDeleted
  }

  static toggle(hymnId: string) {
    if (!this.add(hymnId)) this.delete(hymnId)
  }

  static async setup() {
    Playlists.playlistEdited.on((playlist) => {
      if (playlist == null) return
      if (playlist.id !== 'favorites') return

      this.favoritesChanged.emit(playlist.hymns)
    })
  }
}
