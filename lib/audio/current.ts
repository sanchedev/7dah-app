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

let hymnList: string[] = hymnsIds

export interface CurrentInfo {
  index?: number
  playlistId: string | null
}

export class Current {
  static currentChanged = new Signal<
    [index: number, playlistId: string | null]
  >()

  static isCurrent(info: CurrentInfo) {
    return (
      info.playlistId === playlistId &&
      (info.index == null || info.index === index)
    )
  }

  static skip(newIndex: number | undefined, newPlaylistId?: string | null) {
    console.log(index, playlistId)
    console.log(newIndex, newPlaylistId)

    const playlistIdToChange =
      newPlaylistId === undefined ? playlistId : newPlaylistId
    const indexToChange = newIndex ?? index

    if (playlistIdToChange === playlistId && indexToChange === index) {
      this.currentChanged.emit(index, playlistId)
      PlayerManager.player.seekTo(0)

      return
    }

    const newPlaylist =
      playlistIdToChange == null ? null : Playlists.get(playlistIdToChange)

    const newHymnList = newPlaylist?.hymns ?? hymnsIds

    if (indexToChange < 0 || indexToChange >= newHymnList.length) {
      this.reset()
      return
    }

    if (indexToChange === -1) {
      PlayerManager.player.clearLockScreenControls()
    } else if (index === -1) {
      getHymnMetadata(hymnList[indexToChange]).then((m) => {
        PlayerManager.player.setActiveForLockScreen(true, m, {
          showSeekBackward: true,
          showSeekForward: true,
        })
      })
    } else {
      getHymnMetadata(hymnList[indexToChange]).then((m) => {
        PlayerManager.player.updateLockScreenMetadata(m)
      })
    }

    playlistId = newPlaylist === undefined ? null : playlistIdToChange
    hymnList = newHymnList
    index = indexToChange

    console.log('Emitting currentChanged with', index, playlistId)

    this.currentChanged.emit(index, playlistId)

    if (PlayerManager.player.playing) PlayerManager.player.pause()

    if (index !== -1) {
      getHymnAudioSource(hymnList[index]).then((src) => {
        PlayerManager.player.replace(src)
      })
    }

    PlayerManager.player.seekTo(0)
  }

  static getIndex(): number {
    return index
  }
  static getPlaylistId(): string | null {
    return playlistId
  }

  static getHymnId(): string | undefined {
    return this.getHymnList()[this.getIndex()]
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
    this.skip(-1, null)
  }
}

async function getHymnMetadata(hymnId: string): Promise<AudioMetadata> {
  const hymn = Hymns.get(hymnId)!
  const visual = await Visuals.getFromHymnId(hymn.id)

  return {
    title: 'Himno #' + hymnId.toUpperCase() + ' - ' + hymn.title,
    artworkUrl: visual?.url,
  }
}

async function getHymnAudioSource(hymnId: string): Promise<string> {
  return Hymns.getAudioSrc(hymnId)
}
