import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { Hymns } from '../hymns/hymns'
import { Preferences } from '../preferences/preferences'
import { Signal } from '../signal'
import { PlayerManager } from './audio-player'
import { Current, CurrentInfo } from './current'
import { History } from './history'

export class AudioControllers {
  static playStateChanged = new Signal<[playing: boolean]>()
  static currentTimeChanged = new Signal<[currentTime: number]>()
  static loopChanged = new Signal<[loop: boolean]>()
  static shuffleChanged = new Signal<[shuffle: boolean]>()

  static togglePlay(info?: CurrentInfo) {
    const currentPlaylistId = Current.getPlaylistId()
    const currentIndex = Current.getIndex()

    if (
      info == null ||
      (currentPlaylistId === info.playlistId &&
        (info?.index == null || currentIndex === info.index))
    ) {
      if (PlayerManager.player.playing) {
        PlayerManager.player.pause()
      } else {
        PlayerManager.player.play()
      }
      return
    }

    if (currentPlaylistId !== info.playlistId) {
      Current.skip(info.index ?? currentIndex, info.playlistId)
    } else if (currentIndex !== info.index && info.index != null) {
      Current.skip(info.index)
    }

    PlayerManager.player.play()
  }
  static pause() {
    PlayerManager.player.pause()
  }
  static isPlaying() {
    return PlayerManager.player.playing
  }

  static seek(timeInSec: number) {
    PlayerManager.player.seekTo(timeInSec)
  }
  static getCurrentTime() {
    return PlayerManager.player.currentTime
  }

  static setup() {
    let playing = false
    let currentTime = 0

    let timer: NodeJS.Timeout | number | null = null

    PlayerManager.player.addListener('playbackStatusUpdate', (status) => {
      if (status.playing !== playing) {
        playing = status.playing
        this.playStateChanged.emit(playing)

        if (playing) {
          const hymnId = Current.getHymnId()
          if (hymnId != null) {
            History.push(hymnId)
          }
        }

        if (playing) {
          activateKeepAwakeAsync()
        } else {
          deactivateKeepAwake()
        }

        if (!playing) {
          if (timer != null) clearTimeout(timer)
          timer = setTimeout(
            () => {
              timer = null
              Current.reset()
              PlayerManager.killPlayer()
            },
            15 * 60 * 1000,
          )
        } else {
          if (timer != null) clearTimeout(timer)
        }
      }
      if (status.currentTime !== currentTime) {
        currentTime = status.currentTime
        this.currentTimeChanged.emit(currentTime)
      }
      if (status.didJustFinish) {
        const playlist = Current.getPlaylist()
        const index = Current.getIndex()

        if (Preferences.getLoop()) {
          if (playlist != null) {
            if (index >= playlist.hymns.length - 1) {
              Current.skip(0)
            } else {
              Current.skip(index + 1)
            }
          } else {
            this.seek(0)
          }
          this.togglePlay()
        } else if (Preferences.getShuffle()) {
          const newIndex = Math.floor(
            Math.random() * (playlist?.hymns ?? Hymns.getAllIds()).length,
          )
          Current.skip(newIndex)
          this.togglePlay()
        } else {
          this.pause()
          this.seek(0)
        }
      }
    })
  }
}
