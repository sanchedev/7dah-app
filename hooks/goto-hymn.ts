import { useRouter } from 'expo-router'
import { useCallback } from 'react'

export function useGoToHymn() {
  const router = useRouter()

  const fn = useCallback(
    (hymnNumber: number, playlistId: string | null) => {
      const hymn = hymnNumber.toString().padStart(3, '0')

      if (playlistId == null) {
        router.navigate({
          pathname: '/hymns/[hymn]',
          params: {
            hymn,
          },
        })
      } else {
        router.navigate({
          pathname: '/hymns/[hymn]?playlistId=[playlistId]',
          params: {
            hymn,
            playlistId: playlistId,
          },
        })
      }
    },
    [router],
  )

  return fn
}
