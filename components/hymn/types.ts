import { Hymn } from '@/lib/hymns/types'

export interface HymnActionProps {
  hymn: Hymn
  playlistId?: string
}
export type HymnAction = (props: HymnActionProps) => React.ReactNode
