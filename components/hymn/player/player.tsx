import { NavBarContainer } from '@/components/nav-bar-container'
import { usePlaylist } from '@/hooks/audio/playlist'
import { useVisualFromHymnId } from '@/hooks/visuals/visual'
import { Current } from '@/lib/audio/current'
import { goToHymn } from '@/lib/hymns/link'
import { Hymn } from '@/lib/hymns/types'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import VisualBackground from '../hymn-background'
import { ControlsPlayer } from './controls-player'
import { HeaderPlayer } from './header-player'
import { LyricsPlayer } from './lyrics-player'
import { OptionsPlayer } from './options-player'
import {
  LeadingComponentPlayer,
  TrailingComponentPlayer,
} from './top-bar-player'

interface HymnPlayerProps {
  hymn: Hymn
  playlistId?: string
}

export default function HymnPlayer({ hymn, playlistId }: HymnPlayerProps) {
  const visual = useVisualFromHymnId(hymn.id)

  const insets = useSafeAreaInsets()

  const lastCurrent = useRef({
    index: Current.getIndex(),
    playlistId: Current.getPlaylistId(),
  })

  useEffect(() => {
    const handleCurrentChange = (
      currentIndex: number,
      currentPlaylistId: string | null,
    ) => {
      const index = Current.indexOf(hymn.id, playlistId ?? null)
      const currentHymnId = Current.getHymnId()

      if (currentHymnId != null) {
        if (
          lastCurrent.current.index === index &&
          lastCurrent.current.playlistId === currentPlaylistId &&
          !Current.isCurrent({
            index: Current.indexOf(hymn.id, playlistId ?? null),
            playlistId: playlistId ?? null,
          })
        ) {
          goToHymn(currentHymnId, playlistId, { replace: true })
        }
      }

      lastCurrent.current = {
        index: currentIndex,
        playlistId: currentPlaylistId,
      }
    }

    Current.currentChanged.on(handleCurrentChange)

    return () => {
      Current.currentChanged.off(handleCurrentChange)
    }
  }, [hymn, playlistId])

  const playlist = usePlaylist(playlistId ?? null)

  return (
    <VisualBackground visualId={visual?.id}>
      <NavBarContainer
        title=''
        backgroundOpaque={false}
        leadingComponent={() => <LeadingComponentPlayer hymnId={hymn.id} />}
        trailingComponent={() => <TrailingComponentPlayer />}
        ScrollComponent={({ style, scrollHandler }) => (
          <Animated.ScrollView
            contentContainerStyle={[style]}
            onScroll={scrollHandler}>
            <HeaderPlayer hymn={hymn} />
            <ControlsPlayer hymn={hymn} playlist={playlist} />
            <OptionsPlayer hymn={hymn} />
            <LyricsPlayer hymn={hymn} playlistId={playlist?.id ?? null} />
            <View style={{ height: insets.bottom + 16 }} />
          </Animated.ScrollView>
        )}
      />
    </VisualBackground>
  )
}
