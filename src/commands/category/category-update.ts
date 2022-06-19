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

const newname: ApplicationCommandOptionData = {
  name: 'newname',
  description: 'New Category Name',
  type: 'STRING',
  required: true
}

const newdesc: ApplicationCommandOptionData = {
    name: 'newdescription',
    description: 'New Category Description',
    type: 'STRING',
    required: true
}

const newrarity: ApplicationCommandOptionData = {
    name: 'newrarity',
    description: 'Set the new rarity - TODO update this',
    type: 'STRING',
    required: true
}

export class Edit extends SubCommand {
  name = 'edit'
  description = 'Edit a Category'
  type = 'SUB_COMMAND'
  options = [existingname,newname,newdesc,newrarity]
  async run (client: Client, interaction: BaseCommandInteraction): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    let oldName = ''
    let name ='';
    let desc ='';
    let rarity =0;
    if (interaction.options.get('existingname')?.value === undefined) {
        oldName = 'undefined'
      } else {
        oldName = `${interaction.options.get('existingname')?.value}`
      }
    if (interaction.options.get('newname')?.value === undefined) {
      name = 'undefined'
    } else {
      name = `${interaction.options.get('newname')?.value}`
    }
    if (interaction.options.get('newdescription')?.value === undefined) {
      desc = 'undefined'
    } else {
      desc = `${interaction.options.get('newdescription')?.value}`
    }
    if (interaction.options.get('newrarity')?.value === undefined) {
      rarity = 0
    } else {
      rarity = Number(interaction.options.get('newrarity')?.value)
    }

    try {
      let valid;
      valid = await Category.updateCategory(oldName, name,desc,rarity)
      let content;
      if(valid){
        content = 'Category Updated'
      } else {
        content = 'Not able to find that Category'
      }


      await interaction.followUp({
        ephemeral: true,
        content
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Category Created Successfully'))
      })
    } catch (err) {
      if (err && axios.isAxiosError(err) && err.response && err.response.data.message.includes('Duplicate entry')) {
        const content = 'You have already created this Category!'

        await interaction.followUp({
          ephemeral: true,
          content
        })

        return new Promise((resolve, reject) => {
          resolve(new LogResult(true, LogStatus.Incomplete, 'Category already created'))
        })
      } else {
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
}
