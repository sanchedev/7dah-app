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

  static async getId(visualId: string): Promise<Visual | undefined> {
    const visual = visuals.find((v) => v.id === visualId)

    if (visual == null) return

    return this.#processVisual(visual)
  }
  static async getFromHymnId(hymnId: string): Promise<Visual | undefined> {
    const hymn = Hymns.get(hymnId)

    if (hymn == null) return

    const visual = visuals.find(
      (v) => v.range[0] <= hymn.number && hymn.number <= v.range[1],
    )

    if (visual == null) return

    return this.#processVisual(visual)
  }

  static async #processVisual(semiVisual: Omit<Visual, 'url'>) {
    let url =
      cachedVisuals.get(semiVisual.id) ??
      (await downloadVisual(semiVisual.id, true)) ??
      `https://7dah.vercel.app/visuals/visual-${semiVisual.id}.webp`

    const visual: Visual = {
      ...semiVisual,
      url,
    }

    return visual
  }
}

let loading = new Set<string>()
async function downloadVisual(visualId: string, download: boolean) {
  if (loading.has(visualId)) return

  loading.add(visualId)
  const url = `https://7dah.vercel.app/visuals/visual-${visualId}.webp`

  const finish = (uri: string, downloaded = true) => {
    loading.delete(visualId)
    if (downloaded) cachedVisuals.set(visualId, uri)
    return uri
  }

  if (!download) {
    return finish(url, false)
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
        return finish(file.uri)
      }

      file.delete()
    }

    const output = await File.downloadFileAsync(url, file, { idempotent: true })

    return finish(output.uri)
  } catch (error) {
    console.error(error)
  }
}
