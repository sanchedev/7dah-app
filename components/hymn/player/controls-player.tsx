import { LoopButton } from '@/components/audio/loop-button'
import { PlayPauseButton } from '@/components/audio/play-button'
import { ShuffleButton } from '@/components/audio/shuffle-button'
import { IconButton } from '@/components/ui/icon-button'
import { UiText } from '@/components/ui/text'
import { useCurrentTime } from '@/hooks/audio/audio-controllers'
import { useIsCurrent } from '@/hooks/audio/current'
import { useColors } from '@/hooks/colors'
import { AudioControllers } from '@/lib/audio/audio-controllers'
import { Current } from '@/lib/audio/current'
import { Playlist } from '@/lib/audio/types'
import { Hymn } from '@/lib/types'
import Slider from '@react-native-community/slider'
import { View } from 'react-native'

interface ControlsPlayerProps {
  hymn: Hymn
  playlist: Playlist | null
}

export function ControlsPlayer({ hymn, playlist }: ControlsPlayerProps) {
  return (
    <View>
      <CurrentTimeSlider hymn={hymn} playlist={playlist} />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          marginBottom: 32,
        }}>
        <LoopButton iconSize='md' />
        <SkipPrevBtn hymn={hymn} playlist={playlist} />
        <PlayPauseButton
          info={{
            index: Current.indexOf(hymn.number, playlist?.id ?? null),
            playlistId: playlist?.id ?? null,
          }}
          iconSize='xl'
          filled
        />
        <SkipNextBtn hymn={hymn} playlist={playlist} />
        <ShuffleButton iconSize='md' />
      </View>
    </View>
  )
}

function CurrentTimeSlider({ hymn, playlist }: ControlsPlayerProps) {
  const currentTime = useCurrentTime()
  const colors = useColors()

  const isCurrent = useIsCurrent({
    index: Current.indexOf(hymn.number, playlist?.id ?? null),
    playlistId: playlist?.id ?? null,
  })

  return (
    <>
      <Slider
        style={{
          marginBottom: 16,
          marginTop: 24,
        }}
        thumbTintColor={colors.primaryBackground}
        minimumTrackTintColor={colors.primaryBackground}
        maximumTrackTintColor={colors.secondaryBackground}
        minimumValue={0}
        value={!isCurrent ? 0 : currentTime}
        onValueChange={AudioControllers.seek}
        step={0.125}
        maximumValue={hymn.duration / 1000}
        disabled={!isCurrent}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <UiText>{formatTime(!isCurrent ? 0 : currentTime)}</UiText>
        <UiText>{formatTime(hymn.duration / 1000)}</UiText>
      </View>
    </>
  )
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mins}:${secs}`
}

function SkipPrevBtn({ hymn, playlist }: ControlsPlayerProps) {
  const isCurrent = useIsCurrent({
    index: Current.indexOf(hymn.number, playlist?.id ?? null),
    playlistId: playlist?.id ?? null,
  })

  const handlePress = () => {
    const index = Current.indexOf(hymn.number)
    if (index < 1) return

    Current.setIndex(index - 1)
    AudioControllers.togglePlay()
  }

  return (
    <IconButton
      iconName='skip-previous'
      iconSize='lg'
      onPress={handlePress}
      disabled={!isCurrent}
    />
  )
}

function SkipNextBtn({ hymn, playlist }: ControlsPlayerProps) {
  const isCurrent = useIsCurrent({
    index: Current.indexOf(hymn.number, playlist?.id ?? null),
    playlistId: playlist?.id ?? null,
  })

  const handlePress = () => {
    const index = Current.indexOf(hymn.number)
    if (index >= Current.getHymnList().length - 1) return

    Current.setIndex(index + 1)
    AudioControllers.togglePlay()
  }

  return (
    <IconButton
      iconName='skip-next'
      iconSize='lg'
      onPress={handlePress}
      disabled={!isCurrent}
    />
  )
}
