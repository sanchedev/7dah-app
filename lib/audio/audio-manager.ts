import { AudioMetadata, createAudioPlayer } from 'expo-audio'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { hymns } from '../hymns'
import {
  getFavorites,
  getHistory,
  getPlaylists,
  saveFavorites,
  saveHistory,
} from '../storage'
import { Hymn } from '../types'
import { getVisualFromHymn } from '../visuals'
import { AudioInfo, Playlist } from './types'

interface AudioManagerEvents {
  queueChange: (queue: Hymn[]) => void
  indexChange: (index: number) => void
  playlistChange: (playlistId: string | null) => void
  audioInfoChange: (info: AudioInfo) => void
  playStatusChange: (playing: boolean) => void
  progressChange: (progress: number) => void
  loopChange: (loop: boolean) => void
  shuffleChange: (shuffle: boolean) => void

  historyChange: (history: number[]) => void
  favoritesChange: (favorites: Set<number>) => void
}

export const audioPlayer = createAudioPlayer()

export class AudioManager {
  static #playlists = new Map<string, Playlist>()
  static #currentPlaylistId: string | null = null

  static #history: number[] = []

  static #favorites = new Set<number>()

  static #audioInfo = new Map<number, AudioInfo>()
  static #queue: Hymn[] = []
  static #currentIndex = -1

  static loadPlaylist(playlistId: string) {
    const playList = this.#playlists.get(playlistId)?.hymns

    if (!playList || playList.length < 1) return

    audioPlayer.clearLockScreenControls()
    this.#queue.length = 0
    this.#queue.push(...playList)
    this.#currentIndex = 0
    audioPlayer.replace(getHymnAudioSource(this.#queue[0]))
    this.#emit('queueChange', this.#queue)
    this.#emit('indexChange', 0)
    this.#currentPlaylistId = playlistId
    this.#emit('playlistChange', playlistId)
  }
  static unloadPlaylist() {
    audioPlayer.clearLockScreenControls()
    this.#queue.length = 0
    this.#currentIndex = -1
    this.#emit('queueChange', hymns)
    this.#emit('indexChange', -1)
    this.#currentPlaylistId = null
    this.#emit('playlistChange', null)
  }
  static getCurrentPlaylistId() {
    return this.#currentPlaylistId
  }

  static getAudioInfo(hymnNumber: number) {
    return this.#audioInfo.get(hymnNumber)
  }

  static getCurrentIndex() {
    return this.#currentIndex
  }

  static getQueue() {
    return this.#currentPlaylistId == null ? hymns : this.#queue
  }

  static findHymn(hymn: Hymn) {
    return this.getQueue().indexOf(hymn)
  }

  static play() {
    const queue = this.getQueue()
    if (queue[this.#currentIndex] == null) return

    audioPlayer.play()

    if (queue[this.#currentIndex].number === this.#history.at(-1)) return

    this.#history = this.#history.filter(
      (h) => h !== queue[this.#currentIndex].number,
    )

    this.#history.push(queue[this.#currentIndex].number)

    if (this.#history.length > 15) this.#history.length = 15

    saveHistory(this.#history)
    this.#emit('historyChange', [...this.#history])
  }
  static pause() {
    audioPlayer.pause()
    this.#emit('playStatusChange', false)
  }

  static skip(index: number, play = true) {
    const queue = this.getQueue()

    if (index >= queue.length) return
    if (index < 0) return

    if (this.#currentIndex !== index) {
      this.#currentIndex = index
      if (audioPlayer.playing) audioPlayer.pause()
      audioPlayer.replace(getHymnAudioSource(queue[index]))

      this.#emit('indexChange', index)
    }

    if (play) {
      this.play()
    }
  }
  static skipPrev(play = true) {
    return this.skip(this.#currentIndex - 1, play)
  }
  static skipNext(play = true) {
    return this.skip(this.#currentIndex + 1, play)
  }

  static isPlaying() {
    return audioPlayer.playing
  }

  static getProgress() {
    return audioPlayer.currentTime
  }
  static seek(progress: number) {
    audioPlayer.seekTo(progress)
  }

  static #loop = false
  static #shuffle = false

  static isLoop() {
    return this.#loop
  }
  static setLoop(loop: boolean) {
    this.#loop = loop
    this.#emit('loopChange', loop)
  }

  static isShuffle() {
    return this.#shuffle
  }
  static setShuffle(shuffle: boolean) {
    this.#shuffle = shuffle
    this.#emit('shuffleChange', shuffle)
  }

  static #listeners: {
    [P in keyof AudioManagerEvents]?: AudioManagerEvents[P][]
  } = {}

  static #emit<T extends keyof AudioManagerEvents>(
    name: T,
    ...args: Parameters<AudioManagerEvents[T]>
  ) {
    // @ts-ignore
    this.#listeners[name]?.forEach((fn) => fn(...args))
  }

  static addEventListener<T extends keyof AudioManagerEvents>(
    name: T,
    fn: AudioManagerEvents[T],
  ) {
    if (this.#listeners[name] == null) {
      this.#listeners[name] = []
    }
    this.#listeners[name].push(fn)
  }
  static removeEventListener<T extends keyof AudioManagerEvents>(
    name: T,
    fn: AudioManagerEvents[T],
  ) {
    const i = this.#listeners[name]?.indexOf(fn) ?? -1
    if (i < 0) return
    this.#listeners[name]?.splice(i, 1)
  }

  static getHistory() {
    return this.#history
  }

  static addFavorite(hymn: number) {
    if (this.#favorites.has(hymn)) return
    this.#favorites.add(hymn)
    saveFavorites([...this.#favorites]).then((f) =>
      this.#emit('favoritesChange', new Set(f)),
    )
  }
  static removeFavorite(hymn: number) {
    if (!this.#favorites.has(hymn)) return
    this.#favorites.delete(hymn)
    saveFavorites([...this.#favorites]).then((f) =>
      this.#emit('favoritesChange', new Set(f)),
    )
  }
  static toggleFavorite(hymn: number) {
    if (!this.#favorites.has(hymn)) {
      this.#favorites.add(hymn)
    } else {
      this.#favorites.delete(hymn)
    }
    saveFavorites([...this.#favorites]).then((f) =>
      this.#emit('favoritesChange', new Set(f)),
    )
  }
  static getFavorites() {
    return this.#favorites
  }

  static async #loadHistory() {
    this.#history.push(...new Set(await getHistory()))
  }
  static async #loadPlaylists() {
    for (const playlist of await getPlaylists()) {
      this.#playlists.set(playlist.id, playlist)
    }
  }
  static async #loadFavorites() {
    for (const favorite of await getFavorites()) {
      this.#favorites.add(favorite)
    }
  }

  static #playing = false
  static async setup() {
    let handler: () => void | undefined
    this.addEventListener('indexChange', (index) => {
      if (index < 0) return
      handler = () => {
        const queue = this.getQueue()
        audioPlayer.setActiveForLockScreen(
          true,
          getHymnMetadata(queue[index]),
          { showSeekBackward: true, showSeekForward: true },
        )
        if (isNaN(audioPlayer.duration)) return
        if (!isFinite(audioPlayer.duration)) return
        if (audioPlayer.duration === 0) return
        const audioInfo: AudioInfo = {
          duration: audioPlayer.duration,
        }
        this.#audioInfo.set(queue[index].number, audioInfo)
      }
      handler()
    })

    audioPlayer.addListener('playbackStatusUpdate', (status) => {
      if (this.#playing !== status.playing) {
        this.#emit('playStatusChange', status.playing)
        this.#playing = status.playing
      }
      this.#emit('progressChange', status.currentTime)
      if (status.isLoaded) {
        handler?.()
      }
      if (status.didJustFinish) {
        if (this.#loop) {
          if (this.#currentPlaylistId) {
            if (this.#currentIndex >= this.getQueue().length - 1) {
              this.skip(0, true)
            } else {
              this.skipNext(true)
            }
          } else {
            this.seek(0)
            this.play()
          }
        } else if (!this.#shuffle) {
          this.seek(0)
          this.pause()
        } else {
          const queue = this.getQueue()
          const nextIndex = Math.floor(Math.random() * queue.length)
          this.skip(nextIndex, true)
        }
      }
    })

    this.addEventListener('playStatusChange', (playing) => {
      if (playing) {
        activateKeepAwakeAsync()
      } else {
        deactivateKeepAwake()
      }
    })

    await Promise.all([
      this.#loadHistory(),
      this.#loadFavorites(),
      this.#loadPlaylists(),
    ])
  }
}

function getHymnMetadata(hymn: Hymn): AudioMetadata {
  const hymnId = hymn.number.toString().padStart(3, '0')
  const visual = getVisualFromHymn(hymn.number)!

  return {
    title: 'Himno #' + hymnId + ' - ' + hymn.title,
    artworkUrl: `https://7dah.vercel.app/visuals/visual-${visual.id}.webp`,
  }
}

function getHymnAudioSource(hymn: Hymn): string {
  const hymnId = hymn.number.toString()
  return `https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-${hymnId}.mp3`
}
