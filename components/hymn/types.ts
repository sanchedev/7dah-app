import { Hymn } from '@/lib/hymns/types'
import { Component } from '@/lib/types'

export interface HymnActionProps {
  hymn: Hymn
  playlistId?: string
}
export type HymnAction = Component<HymnActionProps>
