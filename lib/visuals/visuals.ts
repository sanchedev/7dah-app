import { Directory, File, Paths } from 'expo-file-system'
import { Hymns } from '../hymns/hymns'
import visualJson from '../jsons/visuals.json'
import { Visual } from './types'

export const visuals = visualJson as Omit<Visual, 'url'>[]
export const cachedVisuals = new Map<string, string>()

export class Visuals {
  static getAllIds() {
    return visuals.map((v) => v.id)
  }

  static getId(visualId: string): Visual | undefined {
    const visual = visuals.find((v) => v.id === visualId)

    if (visual == null) return

    return this.#processVisual(visual)
  }
  static getFromHymnId(hymnId: string): Visual | undefined {
    const hymn = Hymns.get(hymnId)

    if (hymn == null) return

    const visual = visuals.find(
      (v) => v.range[0] <= hymn.number && hymn.number <= v.range[1],
    )

    if (visual == null) return

    return this.#processVisual(visual)
  }

  static #processVisual(semiVisual: Omit<Visual, 'url'>) {
    const url = cachedVisuals.get(semiVisual.id)

    if (url == null) {
      downloadVisual(semiVisual.id, true).then(
        (uri) => uri && cachedVisuals.set(semiVisual.id, uri),
      )
    }

    const visual: Visual = {
      ...semiVisual,
      url:
        url ?? `https://7dah.vercel.app/visuals/visual-${semiVisual.id}.webp`,
    }

    return visual
  }
}

let loading = new Set<string>()
async function downloadVisual(visualId: string, download: boolean) {
  if (loading.has(visualId)) return

  loading.add(visualId)
  const url = `https://7dah.vercel.app/visuals/visual-${visualId}.webp`

  if (!download) {
    loading.delete(visualId)
    return url
  }

  const destination = new Directory(Paths.cache, 'visuals')
  try {
    if (!destination.exists) {
      destination.create()
    }
    const visualFileName = 'visual-' + visualId + '.webp'

    const file = new File(destination, visualFileName)
    if (file.exists) {
      if (
        file.creationTime != null &&
        file.creationTime <= 1000 * 60 * 60 * 24 * 15
      ) {
        loading.delete(visualId)
        return file.uri
      }

      file.delete()
    }

    const output = await File.downloadFileAsync(url, file, { idempotent: true })

    loading.delete(visualId)
    return output.uri
  } catch (error) {
    console.error(error)
  }
}
