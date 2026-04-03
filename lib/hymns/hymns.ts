import { File, Paths } from 'expo-file-system'
import hymnsJson from '../jsons/hymns.json'
import { Hymn } from './types'

const hymns = hymnsJson as Hymn[]
const hymnsMap = new Map<string, Hymn>()

for (const hymn of hymns) {
  hymnsMap.set(hymn.id, hymn)
}

export class Hymns {
  static getAllIds() {
    return Array.from(hymnsMap.keys())
  }

  static get(id: string) {
    return hymnsMap.get(id)
  }

  static compare(original: Hymn, copy: Hymn) {
    return original.id === copy.id
  }

  static has(id: string) {
    return hymnsMap.has(id)
  }

  static search(text: string) {
    return hymns.flatMap((hymn) => {
      const resultCondition =
        hymn.number.toString().includes(text) ||
        hymn.title.toLowerCase().includes(text.toLowerCase())

      if (resultCondition) return hymn.id
      return []
    })
  }

  static getFromRange(from: number, to: number) {
    const result = hymns.flatMap((h) =>
      from <= h.number && h.number <= to ? h.id : [],
    )
    console.log(result)
    return result
  }

  static getAudioSrc(hymnId: string) {
    const file = new File(Paths.document, '7dah-audios', hymnId + '.mp3')
    if (file.exists) {
      return file.uri
    }

    const num = Hymns.get(hymnId)!.number.toString()
    return `https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-${num}.mp3`
  }

  static async downloadAudio(hymnId: string) {
    const num = Hymns.get(hymnId)!.number.toString()
    const url = `https://res.cloudinary.com/dnlcoyxtq/video/upload/audios/sung/hymn-${num}.mp3`

    const destination = new File(Paths.document, '7dah-audios')
    if (!destination.exists) {
      destination.create()
    }
    const file = new File(destination, hymnId + '.mp3')
    if (file.exists) {
      return file.uri
    }
    const output = await File.downloadFileAsync(url, file)
    return output.uri
  }
}
