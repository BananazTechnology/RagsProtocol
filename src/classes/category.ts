import { RowDataPacket } from 'mysql2'
import { dbQuery } from '../database/db'

export class Category {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private categoryName: string;
  private categoryDescription: string;
  private rarity: number;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor (id: number, categoryName: string, categoryDescription: string, rarity: number) {
    this.id = id
    this.categoryName = categoryName
    this.categoryDescription = categoryDescription
    this.rarity = rarity
  }

  getId () {
    return this.id
  }

  getCategoryName () {
    return this.categoryName
  }

  getCategoryDescription () {
    return this.categoryDescription
  }

  getRarity () {
    return this.rarity
  }

  static async getAllCategories (): Promise<Category[]> {
    const queryString = `
      SELECT c.id, c.category_name, c.category_description, c.rarity
      FROM category AS c
      ORDER BY c.rarity ASC`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const rows = (<RowDataPacket> result)
        const gameResult: Category[] = []
        for (let i = 0; i++; i < rows.length) {
          gameResult.push(new Category(rows[i].id, rows[i].category_name, rows[i].category_description, rows[i].rarity))
        }
        if (gameResult) {
          resolve(gameResult)
        } else {
          resolve([])
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }
}
