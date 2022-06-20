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
        for (let i = 0; i < rows.length; i++) {
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

  static async insertCategory (category_name: string, category_description: string, rarity: number) : Promise<Boolean> {
    const queryString = `
      INSERT INTO category (category_name,category_description,rarity) VALUES('${category_name}','${category_description}',${rarity})`

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

  static async updateCategory (old_category_name: string, category_name: string, category_description: string, rarity: number) : Promise<Boolean> {
    console.log(old_category_name);

    let queryString = `SELECT id FROM category as c WHERE c.category_name = '${old_category_name}' LIMIT 1`

    let oldCatId = await dbQuery(queryString);
    let id;

    const row = (<RowDataPacket> oldCatId)[0]
    if(row){
      id = row.id
    } else {
      id = -1;
    }
    console.log(`ID: ${id}`);

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
      UPDATE category SET category_name = '${category_name}', category_description = '${category_description}', rarity = ${rarity} WHERE id = ${id}`

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

  static async removeCategory (old_category_name: string) : Promise<Boolean> {
    console.log(old_category_name);

    let queryString = `SELECT id,category_name FROM category as c WHERE c.category_name = '${old_category_name}' LIMIT 1`

    let oldCatId = await dbQuery(queryString);
    let id;

    const row = (<RowDataPacket> oldCatId)[0]
    if(row){
      id = row.id
    } else {
      id = -1;
    }
    console.log(`ID: ${id}`);

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
      DELETE FROM category WHERE id = ${id}`
    const result = await dbQuery(queryString)

    queryString = `
      DELETE FROM responses WHERE category_id = ${id}`
    const responsesResult = await dbQuery(queryString)

    return new Promise((resolve, reject) => {
      try {
        
        if(result && responsesResult) {
          resolve(true)
        } else {
          resolve(false)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }

  static async getCategoryByName (category_name: string) : Promise<Category|undefined> {

    console.log(`CATEGORY NAME: ${category_name}`)
    let queryString = `SELECT * FROM category as c WHERE c.category_name = '${category_name}' LIMIT 1`

    let result = await dbQuery(queryString);

    const row = (<RowDataPacket> result)[0]
    console.log(row)
    let category: Category;
    if(row){
      category = new Category(row[0].id, row[0].category_name, row[0].category_description, row[0].rarity)
      console.log(`CATEGORY: ${category}`);
    } 

    return new Promise((resolve, reject) => {
      try {
        
        if(category) {
          resolve(category)
        } else {
          resolve(undefined)
        }
      } catch {
        reject(new Error('DB Connection OR Query Issue'))
      }
    })
  }
}
