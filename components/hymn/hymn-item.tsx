import { useHymn } from '@/hooks/hymn/hymn'
import { useVisualFromHymnId } from '@/hooks/visuals/visual'
import { goToHymn } from '@/lib/hymns/link'
import { Image } from 'expo-image'
import { ListItem, ListItemProps } from '../ui/list-item'
import { HymnAction } from './types'

interface HymnItemProps extends Omit<
  ListItemProps,
  'leadingComp' | 'title' | 'subtitle' | 'trailingComp'
> {
  hymnId: string
  playlistId?: string
  trailingComp?: HymnAction
  onPrevPress?: () => void
}

export function HymnItem({
  hymnId,
  playlistId,
  trailingComp: TrailingComp,
  onPrevPress,
  ...props
}: HymnItemProps) {
  const hymn = useHymn(hymnId)
  const visual = useVisualFromHymnId(hymnId)

  return (
    <ListItem
      leadingComp={() => (
        <Image
          source={{ uri: visual?.url }}
          style={{ flex: 1, aspectRatio: 1, borderRadius: 4 }}
        />
      )}
      title={hymn?.title ?? ''}
      subtitle={`Himno #${hymn?.id.toUpperCase()}`}
      onPress={() => {
        goToHymn(hymnId, playlistId)
      }}
      trailingComp={() =>
        hymn &&
        TrailingComp && <TrailingComp hymn={hymn} playlistId={playlistId} />
      }
      {...props}
    />
  )
}
