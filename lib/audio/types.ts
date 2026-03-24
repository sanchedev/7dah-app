import { Hymn } from '../types'

export interface AudioInfo {
  duration: number
}

export interface Playlist {
  id: string
  name: string
  visualId: string
  hymns: Hymn[]
}
