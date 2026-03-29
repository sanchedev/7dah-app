import { AudioMetadata } from 'expo-audio'
import { hymns } from '../hymns'
import { Signal } from '../signal'
import { Hymn } from '../types'
import { getVisualFromHymn } from '../visuals'
import { PlayerManager } from './audio-player'
import { Playlists } from './playlists'
import { Playlist } from './types'

let index = -1
let playlistId: string | null = null

let playlist: Playlist | null = null
let hymnList: Hymn[] = hymns

export interface CurrentInfo {
  index?: number
  playlistId: string | null
}

export class Current {
  static indexChanged = new Signal<[index: number, hymn: Hymn | null]>()
  static playlistChanged = new Signal<
    [playlist: Playlist | null, hymnList: Hymn[]]
  >()

  static isCurrent(info: CurrentInfo) {
    return (
      info.playlistId === playlistId &&
      (info.index == null || info.index === index)
    )
  }

  static setIndex(newIndex: number) {
    let indexToChange = newIndex
    if (indexToChange < 0 || indexToChange >= hymnList.length) {
      indexToChange = -1
    }

    if (index !== indexToChange) {
      if (indexToChange === -1) {
        PlayerManager.player.clearLockScreenControls()
      } else if (index === -1) {
        PlayerManager.player.setActiveForLockScreen(
          true,
          getHymnMetadata(hymnList[indexToChange]),
          { showSeekBackward: true, showSeekForward: true },
        )
      } else {
        PlayerManager.player.updateLockScreenMetadata(
          getHymnMetadata(hymnList[indexToChange]),
        )
      }

      index = indexToChange
      this.indexChanged.emit(index, hymnList[index] ?? null)

      if (PlayerManager.player.playing) PlayerManager.player.pause()

      if (index !== -1) {
        PlayerManager.player.replace(getHymnAudioSource(hymnList[index]))
      }
    }

    PlayerManager.player.seekTo(0)
  }
  static setPlaylistId(newPlaylistId: string | null, index = -1) {
    playlistId = newPlaylistId

    playlist = playlistId == null ? null : (Playlists.get(playlistId) ?? null)
    hymnList = playlist?.hymns ?? hymns

    this.setIndex(index)

    this.playlistChanged.emit(playlist, hymnList)
  }

  static getIndex(): number {
    return index
  }
  static getPlaylistId(): string | null {
    return playlistId
  }

  static getHymn(): Hymn | null {
    return hymnList[index] ?? null
  }
  static getPlaylist(): Playlist | null {
    return playlistId ? (Playlists.get(playlistId) ?? null) : null
  }
  static getHymnList(): Hymn[] {
    return hymnList.slice()
  }
  static indexOf(hymnNumber: number, playlistId?: string | null) {
    if (playlistId === null) return hymnNumber - 1
    if (playlistId != null)
      return (
        Playlists.get(playlistId)?.hymns.findIndex(
          (h) => h.number === hymnNumber,
        ) ?? -1
      )

    return hymnList.findIndex((h) => h.number === hymnNumber)
  }

  static reset() {
    this.setPlaylistId(null)
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
