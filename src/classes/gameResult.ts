import { RowDataPacket } from 'mysql2'
import { dbQuery } from '../database/db'
import { Category } from './category';

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

  static async getAllResponses (): Promise<GameResult[]> {
    const queryString = `
      SELECT * FROM responses AS r
      ORDER BY r.category_id ASC`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const rows = (<RowDataPacket> result)
        const gameResult: GameResult[] = []
        for (let i = 0; i < rows.length; i++) {
          gameResult.push(new GameResult(rows[i].id, rows[i].message, rows[i].category_id, rows[i].bottom_points, rows[i].top_points))
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

  static async addResponse (message: string, category_id: number, bottom_points: number, top_points: number) : Promise<Boolean> {
    let result: RowDataPacket[] | RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket") | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket")[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader");
    if(category_id) {
      const queryString = `
      INSERT INTO responses (message,category_id,bottom_points,top_points) VALUES('${message}',${category_id},${bottom_points},${top_points})`
      result = await dbQuery(queryString)
    }
    

    return new Promise((resolve, reject) => {
      try {
        
        if(result) {
          resolve(true)
        } else {
          resolve(false)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async removeResponse (messageID: Number) : Promise<Boolean> {

    let queryString = `
      DELETE FROM responses WHERE id = ${messageID}`
    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        
        if(result) {
          resolve(true)
        } else {
          resolve(false)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async updateResponse (existingID: number, newMessage: string, newCategoryName: string, bottom_points: number, top_points: number) : Promise<Boolean> {

    let queryString = `SELECT id FROM category as c WHERE c.category_name = '${newCategoryName}' LIMIT 1`

    let oldCatId = await dbQuery(queryString);
    let id;

    const row = (<RowDataPacket> oldCatId)[0]
    if(row){
      id = row.id
    } else {
      id = -1;
    }

    if(id == -1){
      return new Promise((resolve, reject) => {
        try {
            resolve(false)
        } catch {
          reject(new Error('ID checking error'))
        }
      })
    }
    queryString = `
      UPDATE responses SET message = '${newMessage}', category_id = ${id}, bottom_points = ${bottom_points}, top_points = ${top_points} WHERE id = ${existingID}`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        
        if(result) {
          resolve(true)
        } else {
          resolve(false)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async getBalance (userID: number): Promise<number> {
    const queryString = `
      SELECT c.points
      FROM leaderboard AS c
      WHERE c.user_id = ${userID}
      LIMIT 1`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const row = (<RowDataPacket> result)[0]
        if (row) {
          resolve(row.points)
        } else {
          resolve(0)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }
}
