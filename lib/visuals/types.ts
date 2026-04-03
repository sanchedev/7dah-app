export interface Visual {
  id: string
  range: [number, number]
  theme: 'light' | 'dark'
  orientation: {
    x: number
    y: number
  }
  icon: string
  url: string
}
