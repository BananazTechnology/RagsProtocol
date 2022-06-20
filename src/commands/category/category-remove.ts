import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import axios from 'axios'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { Category } from '../../classes/category'

const existingname: ApplicationCommandOptionData = {
    name: 'existingname',
    description: 'Name of existing Category you want to edit',
    type: 'STRING',
    required: true
}

export class Remove extends SubCommand {
  name = 'remove'
  description = 'remove a Category and all associated responses'
  type = 'SUB_COMMAND'
  options = [existingname]
  async run (client: Client, interaction: BaseCommandInteraction): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    let oldName = ''
    if (interaction.options.get('existingname')?.value === undefined) {
        oldName = 'undefined'
      } else {
        oldName = `${interaction.options.get('existingname')?.value}`
      }

    try {
      let valid;
      valid = await Category.removeCategory(oldName)
      let content;
      if(valid){
        content = 'Category Removed'
      } else {
        content = 'Not able to find that Category'
      }


      await interaction.followUp({
        ephemeral: true,
        content
      })

      if(valid){
        return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Success, 'Category Removed Successfully'))
        })
      } else {
        return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Success, 'Category Not Found Successfully'))
        })
      }
      
    } catch (err) {
        const content = 'Something went wrong, talk to Wock'

        await interaction.followUp({
            ephemeral: true,
            content
        })

        return new Promise((resolve, reject) => {
            reject(new LogResult(false, LogStatus.Error, 'General Category Create Command Error'))
        })
    }
  }
}
