import { Hymns } from '../hymns/hymns'
import categoriesJson from '../jsons/categories.json'
import { Visuals } from '../visuals/visuals'
import { Category, CategoryJson } from './type'

const categories = categoriesJson as CategoryJson[]

const categoriesMap = new Map<string, Category>()

export class Categories {
  static getAll() {
    return categories.slice()
  }

  static async get(categoryId: string) {
    const c = categoriesMap.get(categoryId)
    if (c != null) return c

    const categoryJson = categories.find((c) => c.id === categoryId)
    if (categoryJson == null) return

    const visual = await Visuals.getId(categoryJson.visualId)!
    if (visual == null) return

    const category: Category = {
      id: categoryJson.id,
      title: categoryJson.title,
      description: categoryJson.description,
      visual,
      hymns: Hymns.getFromRange(visual.range[0], visual.range[1]),
    }

    return category
  }
}
