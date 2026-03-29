import { useLoop } from '@/hooks/audio/audio-controllers'
import { AudioControllers } from '@/lib/audio/audio-controllers'
import {
  ToggleIconButton,
  ToggleIconButtonProps,
} from '../ui/toggle-icon-button'

interface LoopButtonProps extends Omit<
  ToggleIconButtonProps,
  'iconName' | 'active' | 'toggle'
> {}

export function LoopButton({ ...props }: LoopButtonProps) {
  const loop = useLoop()

  return (
    <ToggleIconButton
      iconName='loop'
      active={loop}
      toggle={() => AudioControllers.toggleLoop()}
      {...props}
    />
  )
}
