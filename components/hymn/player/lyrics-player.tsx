import { CardView } from '@/components/ui/card'
import { AnimatedUiText } from '@/components/ui/text'
import { useCurrentTime, usePlaying } from '@/hooks/audio/audio-controllers'
import { useIsCurrent } from '@/hooks/audio/current'
import { useColors } from '@/hooks/colors'
import { Current } from '@/lib/audio/current'
import { Hymn } from '@/lib/types'
import { useEffect, useState } from 'react'

interface LyricsPlayerProps {
  hymn: Hymn
  playlistId: string | null
}

export function LyricsPlayer({ hymn, playlistId }: LyricsPlayerProps) {
  const colors = useColors()
  const currentTime = useCurrentTime() * 1000
  const isPlaying = usePlaying()

  const isCurrent = useIsCurrent({
    index: Current.indexOf(hymn.number, playlistId),
    playlistId: playlistId,
  })

  const [currentTimestamp, setCT] = useState(-1)

  useEffect(() => {
    const newTS = hymn.lyrics
      .slice(1, -1)
      .findIndex(
        (lyric, i, newArr) =>
          lyric.timestamp <= (!isCurrent ? 0 : currentTime) + 700 &&
          (newArr[i + 1] == null ||
            newArr[i + 1].timestamp >= (!isCurrent ? 0 : currentTime) - 200),
      )

    setCT(newTS)
  }, [currentTime, hymn, isCurrent])

  return (
    <CardView>
      {hymn.lyrics.slice(1, -1).map((lyric, i) => {
        const light = currentTimestamp === i
        const colorOpaque = !isPlaying || light || currentTimestamp < 0
        return (
          <AnimatedUiText
            key={lyric.kind + i}
            variant='special'
            style={{
              paddingVertical: light ? 0 : 2,
              fontSize: light ? 20 : 18,
              fontFamily: light ? 'RosarioBold' : 'Rosario',
              marginBottom: hymn.lyrics[i + 2]?.index !== lyric.index ? 12 : 0,
              transitionDuration: '200ms',
              transitionProperty: 'all',
              color: colors.cardForeground + (colorOpaque ? '' : '88'),
            }}>
            {lyric.line}
          </AnimatedUiText>
        )
      })}
    </CardView>
  )
}
