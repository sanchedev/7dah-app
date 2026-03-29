export class Signal<T extends any[]> {
  #listeners = new Set<(...args: T) => void>()

  emit(...args: T) {
    this.#listeners.forEach((fn) => fn(...args))
  }

  on(fn: (...args: T) => void) {
    this.#listeners.add(fn)
  }
  off(fn: (...args: T) => void) {
    return this.#listeners.delete(fn)
  }
}
