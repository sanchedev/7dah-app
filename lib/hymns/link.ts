import { router } from 'expo-router'

export function goToHymn(
  hymnId: string,
  playlistId?: string,
  options: { replace?: boolean } = {},
) {
  const href = {
    pathname:
      '/hymns/[hymnId]' +
      (playlistId != null ? '?playlistId=[playlistId]' : ''),
    params: {
      hymnId,
      playlistId,
    },
  }

  // if (options.replace) {
  //   requestAnimationFrame(() => {
  //     try {
  //       // @ts-ignore
  //       router.replace(href)
  //     } catch (error) {
  //       console.error('Failed to replace route:', error)
  //       // @ts-ignore
  //       router.navigate(href)
  //     }
  //   })
  // } else {
  // @ts-ignore
  router.navigate(href)
  // }
}
