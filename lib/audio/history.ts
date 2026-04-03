import { Signal } from '../signal'
import { getHistory, saveHistory } from '../storage'

const history: string[] = []

export class History {
  static historyChanged = new Signal<[history: string[]]>()

  static #change(newHistory: string[]) {
    history.length = 0

    history.push(...newHistory)
    this.historyChanged.emit(newHistory)
    saveHistory(newHistory)
  }

  static async push(hymn: string) {
    const newHistory = history.filter((h) => hymn !== h)
    newHistory.unshift(hymn)

    this.#change(newHistory)
  }

  static get() {
    return history.slice()
  }

  static async setup() {
    const newHistory: string[] = []

    for (const hymn of await getHistory()) {
      if (newHistory.includes(hymn)) continue

      newHistory.push(hymn)
    }

    this.#change(newHistory)
  }
}
