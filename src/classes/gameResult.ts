import { RowDataPacket } from 'mysql2'
import { dbQuery } from '../database/db'

export class GameResult {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private message: string;
  private categoryId: number;
  private bottomPoints: number;
  private topPoints: number;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor (id: number, message: string, categoryId: number, bottomPoints: number, topPoints: number) {
    this.id = id
    this.message = message
    this.categoryId = categoryId
    this.bottomPoints = bottomPoints
    this.topPoints = topPoints
  }

  getId () {
    return this.id
  }

  getMessage () {
    return this.message
  }

  getCategory () {
    return this.categoryId
  }

  getBottomPoints () {
    return this.bottomPoints
  }

  getTopPoints () {
    return this.topPoints
  }

  static async getGameResult (categoryID: number): Promise<GameResult|undefined> {
    const queryString = `
      SELECT c.id, c.message, c.category_id, c.bottom_points, c.top_points
      FROM responses AS c
      WHERE c.category_id = ${categoryID}
      ORDER BY RAND()
      LIMIT 1`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)[0]
        if (row) {
          const gameResult: GameResult = new GameResult(row.id, row.message, row.category_id, row.bottom_points, row.top_points)
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
