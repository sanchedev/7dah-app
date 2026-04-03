import { Visual } from '../visuals/types'

export interface CategoryJson {
  id: string
  title: string
  description: string
  visualId: string
}
export interface Category {
  id: string
  title: string
  description: string
  visual: Visual
  hymns: string[]
}
