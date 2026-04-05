import { FavoriteButton } from '@/components/audio/favorite-button'
import { IconButton } from '@/components/ui/icon-button'
import { router } from 'expo-router'

export function TrailingComponentPlayer() {
  return <IconButton iconName='arrow-back' onPress={() => router.back()} />
}
export function LeadingComponentPlayer({ hymnId }: { hymnId: string }) {
  return <FavoriteButton hymnId={hymnId} />
}
