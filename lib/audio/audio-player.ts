import { AudioPlayer, createAudioPlayer } from 'expo-audio'
import { Signal } from '../signal'

let player: AudioPlayer | null = null

export class PlayerManager {
  static get player() {
    if (player == null) {
      player = createAudioPlayer()
      this.playerCreated.emit()
    }
    return player
  }

  static killPlayer() {
    if (player != null) {
      player.removeAllListeners('audioSampleUpdate')
      player.removeAllListeners('playbackStatusUpdate')
      player.pause()
      player.clearLockScreenControls()
      player.remove()
      player = null
    }
  }

  static playerCreated = new Signal<[]>()
}
