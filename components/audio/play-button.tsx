import { usePlaying } from '@/hooks/audio/audio-controllers'
import { useIsCurrent } from '@/hooks/audio/current'
import { AudioControllers } from '@/lib/audio/audio-controllers'
import { CurrentInfo } from '@/lib/audio/current'
import { IconButton, IconButtonProps } from '../ui/icon-button'

interface PlayPauseButtonProps extends Omit<IconButtonProps, 'iconName'> {
  info?: CurrentInfo
}

export function PlayPauseButton({ info, ...props }: PlayPauseButtonProps) {
  const playing = usePlaying()
  const isCurrent = useIsCurrent(info)

  return (
    <IconButton
      iconName={!playing || !isCurrent ? 'play-arrow' : 'pause'}
      onPress={() => {
        AudioControllers.togglePlay(info)
      }}
      {...props}
    />
  )
}
