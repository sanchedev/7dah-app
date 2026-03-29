import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { hymns } from '../hymns'
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
    console.log('-> AudioControllers.togglePlay')
    const currentPlaylistId = Current.getPlaylistId()
    const currentIndex = Current.getIndex()

    console.log('Current Playlist ID: ', currentPlaylistId)
    console.log('Current Index: ', currentIndex)

    if (
      info == null ||
      (currentPlaylistId === info.playlistId &&
        (info == null || currentIndex === info.index))
    ) {
      console.log('Info is null or Info is same current')

      if (PlayerManager.player.playing) {
        console.log('Pausing...')
        PlayerManager.player.pause()
      } else {
        console.log('Playing...')
        PlayerManager.player.play()
      }
      console.log('<- End')
      return
    }

    if (currentPlaylistId !== info.playlistId) {
      console.log('Current Playlist ID is different to Info')
      console.log(
        'Setting Playlist ID to ',
        info.playlistId,
        ' with index ',
        info.index ?? 0,
        '...',
      )
      Current.setPlaylistId(info.playlistId, info.index ?? 0)
    } else if (currentIndex !== info.index && info.index != null) {
      console.log('Current Index is different to Info and Index is not null')
      console.log('Setting Current Index to ', info.index, '...')
      Current.setIndex(info.index)
    }

    console.log('Playing...')
    PlayerManager.player.play()

    console.log('<- End')
  }
  static pause() {
    console.log('-> AudioControllers.pause')
    console.log('Pausing...')
    PlayerManager.player.pause()
    console.log('<- End')
  }
  static isPlaying() {
    console.log('-> AudioControllers.isPlaying')
    console.log('Getting value...')
    console.log('Playing is ', PlayerManager.player.playing)
    console.log('<- End')
    return PlayerManager.player.playing
  }

  static seek(timeInSec: number) {
    console.log('-> AudioControllers.seek')
    console.log('Seeking to ', timeInSec)
    PlayerManager.player.seekTo(timeInSec)
    console.log('<- End')
  }
  static getCurrentTime() {
    console.log('-> AudioControllers.getCurrentTime')
    console.log('Getting value...')
    console.log('Current Time is ', PlayerManager.player.currentTime)
    console.log('<- End')
    return PlayerManager.player.currentTime
  }

  static #loop = false
  static toggleLoop() {
    console.log('-> AudioControllers.toggleLoop')
    console.log('Changing loop from ', this.#loop, ' to ', !this.#loop, '...')
    this.#loop = !this.#loop
    console.log(':: Emiting `loopChanged` signal...')
    this.loopChanged.emit(this.#loop)

    if (this.#loop && this.#shuffle) {
      console.log('Loop and Shuffle are true!')
      console.log('Toggling Shuffle')
      this.toggleShuffle()
    }
  }
  static isLoop() {
    console.log('-> AudioControllers.isLoop')
    console.log('Getting value...')
    console.log('Loop is ', this.#loop)
    console.log('<- End')
    return this.#loop
  }

  static #shuffle = false
  static toggleShuffle() {
    console.log('-> AudioControllers.toggleShuffle')
    console.log(
      'Changing shuffle from ',
      this.#shuffle,
      ' to ',
      !this.#shuffle,
      '...',
    )
    this.#shuffle = !this.#shuffle
    console.log(':: Emiting `shuffleChanged` signal...')
    this.shuffleChanged.emit(this.#shuffle)

    if (this.#shuffle && this.#loop) {
      console.log('Shuffle and Loop are true!')
      console.log('Toggling Loop')
      this.toggleLoop()
    }
  }
  static isShuffle() {
    console.log('-> AudioControllers.isShuffle')
    console.log('Getting value...')
    console.log('Shuffle is ', this.#shuffle)
    console.log('<- End')
    return this.#shuffle
  }

  static setup() {
    let playing = false
    let currentTime = 0

    let timer: NodeJS.Timeout | number | null = null

    PlayerManager.player.addListener('playbackStatusUpdate', (status) => {
      if (status.playing !== playing) {
        playing = status.playing
        console.log('! Playing now are', playing)
        console.log(':: Emiting `playStateChanged` signal...')
        this.playStateChanged.emit(playing)

        if (playing) {
          const hymnNumber = Current.getHymn()?.number
          if (hymnNumber != null) {
            console.log('Adding Hymn', hymnNumber, 'to History...')
            History.push(hymnNumber)
          }
        }

        if (playing) {
          console.log('Adding Keep Awake...')
          activateKeepAwakeAsync()
        } else {
          console.log('Removing Keep Awake...')
          deactivateKeepAwake()
        }

        if (!playing) {
          console.log('Creating Timeout to kill audio...')
          if (timer != null) clearTimeout(timer)
          timer = setTimeout(
            () => {
              timer = null
              Current.reset()
              PlayerManager.killPlayer()
            },
            15 * 60 * 1000,
          )
          console.log('Timeout wait 15min')
        } else {
          console.log('Clearing the Timeout...')
          if (timer != null) clearTimeout(timer)
        }

        console.log('End !')
      }
      if (status.currentTime !== currentTime) {
        currentTime = status.currentTime
        this.currentTimeChanged.emit(currentTime)
      }
      if (status.didJustFinish) {
        console.log('! Hymn has finished')
        console.log('Getting currents...')
        const playlist = Current.getPlaylist()
        const index = Current.getIndex()

        if (this.#loop) {
          console.log('Loop is active')
          if (playlist != null) {
            console.log('Playlist is not null')
            if (index >= playlist.hymns.length - 1) {
              console.log('This is the last Hymn')
              console.log('Setting index to 0...')
              Current.setIndex(0)
            } else {
              console.log('This is not the last Hymn')
              console.log('Changing index to next...')
              Current.setIndex(index + 1)
            }
          } else {
            console.log('Restart audio')
            this.seek(0)
          }
          console.log('Playing...')
          this.togglePlay()
        } else if (this.#shuffle) {
          console.log('Shuffle is active')
          console.log(
            'Using ' +
              (playlist == null ? 'all Hymns' : 'Playlist ' + playlist.id) +
              '...',
          )
          console.log('Getting random Index...')
          const newIndex = Math.floor(
            Math.random() * (playlist?.hymns ?? hymns).length,
          )
          console.log('Setting random Index...')
          Current.setIndex(newIndex)
          console.log('Playing...')
          this.togglePlay()
        } else {
          console.log('Pausing...')
          this.pause()
          console.log('Seeking to 0...')
          this.seek(0)
        }

        console.log('End !')
      }
    })
  }
}
