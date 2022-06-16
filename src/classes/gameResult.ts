import { RowDataPacket } from 'mysql2';
import { GameSpecificDb } from '../database/db'

export class GameResult {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private id: number;
  private message: string;
  private category_id: number;
  private bottom_points: number;
  private top_points: number;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor (id: number, message: string, category_id: number, bottom_points: number, top_points: number) {
    this.id = id;
    this.message = message;
    this.category_id = category_id;
    this.bottom_points = bottom_points;
    this.top_points = top_points;
  }

  getId () {
    return this.id
  }

  getMessage () {
    return this.message
  }

  getCategory () {
    return this.category_id
  }

  getBottomPoints () {
    return this.bottom_points
  }

  getTopPoints () {
    return this.top_points
  }

  static async getGameResult (categoryID: number): Promise<GameResult> {

    const db = new GameSpecificDb()

    const queryString = `
      SELECT c.id, c.message, c.category_id, c.bottom_points, c.top_points
      FROM responses AS c
      WHERE c.category_id = ${categoryID}
      ORDER BY RAND()
      LIMIT 1`

    const result = await db.query(queryString)

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
