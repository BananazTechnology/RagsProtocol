import { RowDataPacket } from 'mysql2';
import { GameSpecificDb } from '../database/db'

export class Category {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private category_name: string;
  private category_description: string;
  private rarity: number;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor (id: number, category_name: string, category_description: string, rarity: number) {
    this.id = id;
    this.category_name = category_name;
    this.category_description = category_description;
    this.rarity = rarity;
  }

  getId () {
    return this.id
  }

  getCategoryName () {
    return this.category_name
  }

  getCategoryDescription () {
    return this.category_description
  }

  getRarity () {
    return this.rarity
  }

  static async getAllCategories(): Promise<Category[]> {

    const db = new GameSpecificDb()

    const queryString = `
      SELECT c.id, c.category_name, c.category_description, c.rarity
      FROM category AS c
      ORDER BY c.rarity ASC`

    const result = await db.query(queryString)

    return new Promise((resolve, reject) => {
        try {
          const rows = (<RowDataPacket> result)
          let gameResult;
          for(let i = 0; i++; i < rows.length){
            gameResult.push(new Category(rows[i].id, rows[i].category_name, rows[i].category_description, rows[i].rarity))
          }
          if (gameResult) {
            resolve(gameResult)
          } else {
            resolve(undefined)
          }
        } catch {
          reject(new Error('DB Connection OR Query Issue'))
        }
      })
  }
}
