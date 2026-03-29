import { IconButton, IconButtonProps } from '../ui/icon-button'

export interface ToggleIconButtonProps extends IconButtonProps {
  active: boolean
  toggle: () => void
}

export function ToggleIconButton({
  active,
  toggle,
  ...props
}: ToggleIconButtonProps) {
  return (
    <IconButton
      filled={active}
      color={active ? 'secondaryBackground' : undefined}
      hover={active ? 'secondaryBackground' : undefined}
      iconColor={active ? 'secondaryForeground' : undefined}
      onPress={toggle}
      {...props}
    />
  )
}
