import { useShuffle } from '@/hooks/audio/audio-controllers'
import { Preferences } from '@/lib/preferences/preferences'
import {
  ToggleIconButton,
  ToggleIconButtonProps,
} from '../ui/toggle-icon-button'

interface ShuffleButtonProps extends Omit<
  ToggleIconButtonProps,
  'iconName' | 'active' | 'toggle'
> {}

export function ShuffleButton({ ...props }: ShuffleButtonProps) {
  const shuffle = useShuffle()

  return (
    <ToggleIconButton
      iconName='shuffle'
      active={shuffle}
      toggle={() => Preferences.toggleShuffle()}
      {...props}
    />
  )
}
