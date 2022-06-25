import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { GameResult } from '../../classes/gameResult'

const existingID: ApplicationCommandOptionData = {
    name: 'responseid',
    description: 'Id of existing response you want to remove. Id can be seen in responses view command',
    type: 'NUMBER',
    required: true
}

export class Remove extends SubCommand {
  name = 'remove'
  description = 'remove a single response based off the id'
  type = 'SUB_COMMAND'
  options = [existingID]
  async run (client: Client, interaction: BaseCommandInteraction): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    let oldName = 0
    if (interaction.options.get('responseid')?.value === undefined) {
        oldName = 0
      } else {
        oldName = Number(interaction.options.get('responseid')?.value)
      }

    try {
      let valid;
      valid = await GameResult.removeResponse(oldName)
      let content;
      if(valid){
        content = 'Response Removed'
      } else {
        content = 'Not able to find that Response'
      }


      await interaction.followUp({
        ephemeral: true,
        content
      })

      if(valid){
        return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Success, 'Response Removed Successfully'))
        })
      } else {
        return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Success, 'Response Not Found Successfully'))
        })
      }
      
    } catch (err) {
        const content = 'Something went wrong, talk to Wock'

        await interaction.followUp({
            ephemeral: true,
            content
        })

        return new Promise((resolve, reject) => {
            reject(new LogResult(false, LogStatus.Error, 'General Response Remove Command Error'))
        })
    }
  }
}
