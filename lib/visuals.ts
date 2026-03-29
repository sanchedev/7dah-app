import visualJson from './jsons/visuals.json'
import { Visual } from './types'
import { visualAssetMaps } from './visual-assets'

export const visuals = visualJson as Visual[]

export function getVisualFromId(visualId: string) {
  return visuals.find((v) => v.id === visualId)
}
export function getVisualFromHymn(hymnNumber: number) {
  return visuals.find(
    (v) => v.range[0] <= hymnNumber && hymnNumber <= v.range[1],
  )
}

export function getVisualAsset(visualId: string) {
  return visualAssetMaps.get(visualId)
}
