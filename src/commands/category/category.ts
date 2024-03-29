import { BaseCommandInteraction, Client } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { SubCommand } from '../../interfaces/subCommand'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { View } from './category-view'
import { Add } from './category-add'
import { Edit } from './category-update'
import { Remove } from './category-remove'

export class Category extends Command {
  name = 'category'
  description = 'Category Command'
  type = 'CHAT_INPUT'
  requiredRole = 984604490013487187n;
  options: SubCommand[] = [new View(), new Add(), new Edit(), new Remove()]//new Create(), new View(), new Other(), new Edit()]

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    return new Promise((resolve, reject) => {
      try {
        interaction.options.data.forEach(option => {
          if (option.type === 'SUB_COMMAND') {
            this.options.find((c) => c.name === option.name)?.execute(client, interaction, user)
              .then((res: LogResult) => {
                resolve(res)
              })
              .catch((res: LogResult) => {
                reject(res)
              })
          } else {
            reject(new LogResult(false, LogStatus.Error, 'No sub command provided for Category'))
          }
        })
      } catch {
        reject(new LogResult(false, LogStatus.Error, 'General Category Command Error'))
      }
    })
  }
}
