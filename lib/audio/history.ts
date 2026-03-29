import { Signal } from '../signal'
import { getHistory, saveHistory } from '../storage'

const history: number[] = []

export class History {
  static historyChanged = new Signal<[history: number[]]>()

  static #change(newHistory: number[]) {
    history.length = 0

    history.push(...newHistory)
    this.historyChanged.emit(newHistory)
    saveHistory(newHistory)
  }

  static async push(hymn: number) {
    const newHistory = history.filter((h) => hymn !== h)
    newHistory.unshift(hymn)

    this.#change(newHistory)
  }

  static get() {
    return history.slice()
  }

  static async setup() {
    const newHistory: number[] = []

    for (const hymn of await getHistory()) {
      if (newHistory.includes(hymn)) continue

      newHistory.push(hymn)
    }

    this.#change(newHistory)
  }
}
