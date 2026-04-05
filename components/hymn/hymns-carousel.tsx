import { useHymn } from '@/hooks/hymn/hymn'
import { goToHymn } from '@/lib/hymns/link'
import { ComponentProps } from '@/lib/types'
import { Visuals } from '@/lib/visuals/visuals'
import { Carousel, CarouselProps } from '../ui/carousel/carousel'
import { VisualCard } from '../visuals/visual-card'
import { HymnAction } from './types'

interface HymnCardProps extends Omit<
  CarouselProps<ComponentProps<typeof HymnCard>>,
  'data' | 'cardComponent'
> {
  data: { hymnId: string; playlistId?: string }[]
  action?: HymnAction
}

export function HymnCarousel({
  data,
  action,
  contentContainerStyle,
  ...props
}: HymnCardProps) {
  return (
    <Carousel
      data={data.map(({ hymnId: h, playlistId: p }) => ({
        id: `card-${p}:${h}`,
        props: {
          hymnId: h,
          playlistId: p,
          action,
        },
      }))}
      cardComponent={HymnCard}
      {...props}
    />
  )
}

function HymnCard({
  hymnId,
  playlistId,
  action: Action,
}: {
  hymnId: string
  playlistId?: string
  action?: HymnAction
}) {
  const hymn = useHymn(hymnId)

  return (
    <VisualCard
      visualId={Visuals.getIdFromHymnId(hymnId)}
      onPress={() => goToHymn(hymnId, playlistId)}
      title={hymn?.title ?? ''}
      subtitle={`Himno #${hymn?.id.toUpperCase()}`}
      leading={
        Action && hymn && (() => <Action hymn={hymn} playlistId={playlistId} />)
      }
    />
  )
}
