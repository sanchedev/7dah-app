import { AudioMetadata } from 'expo-audio'
import { Hymns } from '../hymns/hymns'
import { Signal } from '../signal'
import { Visuals } from '../visuals/visuals'
import { PlayerManager } from './audio-player'
import { Playlists } from './playlists'
import { Playlist } from './types'

const hymnsIds = Hymns.getAllIds()

let index = -1
let playlistId: string | null = null

let playlist: Playlist | null = null
let hymnList: string[] = hymnsIds

export interface CurrentInfo {
  index?: number
  playlistId: string | null
}

export class Current {
  static indexChanged = new Signal<
    [index: number, hymnId: string | undefined]
  >()
  static playlistChanged = new Signal<
    [playlist: Playlist | null, hymnList: string[]]
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
        getHymnAudioSource(hymnList[index]).then((src) => {
          PlayerManager.player.replace(src)
        })
      }
    }

    PlayerManager.player.seekTo(0)
  }
  static setPlaylistId(newPlaylistId: string | null, index = -1) {
    playlistId = newPlaylistId

    playlist = playlistId == null ? null : (Playlists.get(playlistId) ?? null)
    hymnList = playlist?.hymns ?? hymnsIds

    this.setIndex(index)

    this.playlistChanged.emit(playlist, hymnList)
  }

  static getIndex(): number {
    return index
  }
  static getPlaylistId(): string | null {
    return playlistId
  }

  static getHymnId(): string | undefined {
    return hymnList[index] ?? undefined
  }
  static getPlaylist(): Playlist | null {
    return playlistId ? (Playlists.get(playlistId) ?? null) : null
  }
  static getHymnList(): string[] {
    return hymnList.slice()
  }
  static indexOf(hymnId: string, playlistId?: string | null) {
    if (playlistId === null) return hymnsIds.indexOf(hymnId)
    if (playlistId != null)
      return Playlists.get(playlistId)?.hymns.indexOf(hymnId) ?? -1

    return hymnList.indexOf(hymnId)
  }

  static reset() {
    this.setPlaylistId(null)
  }
}

function getHymnMetadata(hymnId: string): AudioMetadata {
  const hymn = Hymns.get(hymnId)!
  const visual = Visuals.getFromHymnId(hymn.id)

  return {
    title: 'Himno #' + hymnId.toUpperCase() + ' - ' + hymn.title,
    artworkUrl: `https://7dah.vercel.app/visuals/visual-${visual?.id ?? '00'}.webp`,
  }
}

async function getHymnAudioSource(hymnId: string): Promise<string> {
  return Hymns.getAudioSrc(hymnId)
}
