import { Signal } from '../signal'
import { getPreferences, PreferencesType, savePreferences } from '../storage'

export class Preferences {
  static loopChanged = new Signal<[loop: boolean]>()
  static shuffleChanged = new Signal<[shuffle: boolean]>()

  static #preferences: Required<PreferencesType> = {
    loop: false,
    shuffle: false,
  }

  static setLoop(loop: boolean) {
    this.toggleLoop(loop)
  }
  static setShuffle(shuffle: boolean) {
    this.toggleShuffle(shuffle)
  }

  static getLoop() {
    return this.#preferences.loop
  }
  static getShuffle() {
    return this.#preferences.shuffle
  }

  static toggleLoop(loop?: boolean) {
    if (this.#preferences.loop === loop) {
      return
    }

    this.#preferences.loop = loop ?? !this.#preferences.loop

    this.loopChanged.emit(this.#preferences.loop)
    this.#save()

    if (this.#preferences.loop && this.#preferences.shuffle) {
      this.toggleShuffle()
    }
  }
  static toggleShuffle(shuffle?: boolean) {
    if (this.#preferences.shuffle === shuffle) {
      return
    }

    this.#preferences.shuffle = shuffle ?? !this.#preferences.shuffle
    this.shuffleChanged.emit(this.#preferences.shuffle)
    this.#save()

    if (this.#preferences.shuffle && this.#preferences.loop) {
      this.toggleLoop()
    }
  }

  static async #save() {
    await savePreferences(this.#preferences)
  }

  static async setup() {
    const preferences = await getPreferences()

    this.#preferences = { ...this.#preferences, ...preferences }

    this.loopChanged.emit(this.#preferences.loop)
    this.shuffleChanged.emit(this.#preferences.shuffle)
  }
}
