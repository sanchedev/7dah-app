import { Signal } from '../signal'
import { getFavorites, saveFavorites } from '../storage'

const favorites = new Set<number>()

export class Favorites {
  static favoritesChanged = new Signal<[favorites: Set<number>]>()

  static #change() {
    this.favoritesChanged.emit(this.get())
    saveFavorites(Array.from(favorites))
  }

  static get(): Set<number> {
    return new Set(favorites)
  }

  static add(hymnNumber: number): boolean {
    if (favorites.has(hymnNumber)) return false

    favorites.add(hymnNumber)
    this.#change()
    return true
  }

  static delete(hymnNumber: number): boolean {
    if (!favorites.has(hymnNumber)) return false
    const hasDeleted = favorites.delete(hymnNumber)

    this.#change()

    return hasDeleted
  }

  static toggle(hymnNumber: number) {
    if (!this.add(hymnNumber)) this.delete(hymnNumber)
  }

  static async setup() {
    favorites.clear()
    for (const hymnNumber of await getFavorites()) {
      favorites.add(hymnNumber)
    }
  }
}
