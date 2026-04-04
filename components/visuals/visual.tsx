import { useVisual } from '@/hooks/visuals/visual'
import { Image, ImageProps } from 'expo-image'

export interface VisualImageProps extends Omit<ImageProps, 'source'> {
  visualId?: string
}

export function VisualImage({ visualId, ...rest }: VisualImageProps) {
  const visual = useVisual(visualId)

  return <Image source={{ uri: visual?.url }} {...rest} />
}
