import { RowDataPacket } from 'mysql2'
import { dbQuery } from '../database/db'

export class Balance {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private user_id: number;
  private points: number;
  private discordID: string;

  // constructor is private. User object sould be created by one of the get or create commands
  private constructor ( user_id: number, points: number, discordID: string) {
    this.user_id = user_id;
    this.points = points;
    this.discordID = discordID;

  }

  getUserId () {
    return this.user_id
  }

  getPoints () {
    return this.points
  }

  getDiscordID () {
    return this.discordID
  }

  static async getLeaderboard (): Promise<Balance[]> {
    const queryString = `
      SELECT l.user_id, l.points, l.discordID
      FROM leaderboard AS l
      ORDER BY l.points DESC`

    const result = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        const rows = (<RowDataPacket> result)
        const leaderboard: Balance[] = []
        for (let i = 0; i < rows.length; i++) {
          leaderboard.push(new Balance(rows[i].user_id, rows[i].points, rows[i].discordID))
        }
        if (leaderboard) {
          resolve(leaderboard)
        } else {
          resolve([])
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

static async updateBalance (userID: number, points: number, discordID: string) : Promise<Boolean> {
    const queryString = `
      INSERT INTO leaderboard
      (user_id,points,discordID)
      VALUES(${userID}, ${points}, ${discordID})
      ON DUPLICATE KEY
      UPDATE user_id = ${userID}, points = points + ${points}, discordID = ${discordID.toString()}`

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


}
