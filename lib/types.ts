export interface Hymn {
  number: number
  title: string
  lyrics: Lyric[]
  verseAssociated?: string
}

export interface Lyric {
  kind: 'verse' | 'chorus' | 'title'
  line: string
  index: number
  timestamp: number
}

export interface Visual {
  id: '01'
  range: [number, number]
  theme: 'light' | 'dark'
  orientation: {
    x: number
    y: number
  }
  icon: 'group'
}
