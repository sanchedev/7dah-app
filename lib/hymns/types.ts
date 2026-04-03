export interface Hymn {
  id: string
  number: number
  title: string
  lyrics: Lyric[]
  verseAssociated?: string
  duration: number
}

export interface Lyric {
  kind: 'verse' | 'chorus' | 'title'
  line: string
  index: number
  timestamp: number
}
