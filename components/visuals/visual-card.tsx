import {
  PressableCard,
  PressableCardProps,
} from '../ui/carousel/pressable-card'
import { VisualImage } from './visual-image'

export interface VisualCardProps extends Omit<PressableCardProps, 'image'> {
  visualId?: string
}

export function VisualCard({ visualId, ...props }: VisualCardProps) {
  return (
    <PressableCard
      image={({ height, width }) => (
        <VisualImage
          visualId={visualId}
          style={{ width, height, aspectRatio: 1, borderRadius: 12 }}
        />
      )}
      {...props}
    />
  )
}
