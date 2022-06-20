import { BaseCommandInteraction, Client } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { SubCommand } from '../../interfaces/subCommand'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { View } from './response-view'
import { Add } from './response-add'

export class Response extends Command {
  name = 'response'
  description = 'Response Command'
  type = 'CHAT_INPUT'
  options: SubCommand[] = [new View(), new Add()];//new View(), new Add(), new Edit(), new Remove()]

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
