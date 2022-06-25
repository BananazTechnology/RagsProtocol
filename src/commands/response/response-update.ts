import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import axios from 'axios'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { GameResult } from '../../classes/gameResult'

const existingID: ApplicationCommandOptionData = {
    name: 'existingid',
    description: 'ID of existing response you want to edit viewable in response view',
    type: 'STRING',
    required: true
}

const newmessage: ApplicationCommandOptionData = {
  name: 'newmessage',
  description: 'New Category Name',
  type: 'STRING',
  required: true
}

const newcategoryname: ApplicationCommandOptionData = {
    name: 'newcategoryname',
    description: 'New Category Name',
    type: 'STRING',
    required: true
}

const bottom_points: ApplicationCommandOptionData = {
    name: 'bottompoints',
    description: 'update the bottom points',
    type: 'NUMBER',
    required: true
}

const top_points: ApplicationCommandOptionData = {
    name: 'toppoints',
    description: 'update the top points',
    type: 'NUMBER',
    required: true
}

export class Update extends SubCommand {
  name = 'edit'
  description = 'Edit a Response'
  type = 'SUB_COMMAND'
  options = [existingID, newmessage, newcategoryname, bottom_points, top_points]
  async run (client: Client, interaction: BaseCommandInteraction): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    let existingID = 0;
    let newMessage ='';
    let newCategoryName ='';
    let bottom_points =0;
    let top_points =0;

    if (interaction.options.get('existingid')?.value === undefined) {
        existingID = 0;
    } else {
        existingID = Number(interaction.options.get('existingid')?.value);
    }

    if (interaction.options.get('newmessage')?.value === undefined) {
      newMessage = 'undefined'
    } else {
      newMessage = `${interaction.options.get('newmessage')?.value}`
    }

    if (interaction.options.get('newcategoryname')?.value === undefined) {
      newCategoryName = 'undefined'
    } else {
      newCategoryName = `${interaction.options.get('newcategoryname')?.value}`
    }

    if (interaction.options.get('bottompoints')?.value === undefined) {
      bottom_points = 0
    } else {
      bottom_points = Number(interaction.options.get('bottompoints')?.value)
    }

    if (interaction.options.get('toppoints')?.value === undefined) {
        top_points = 0
    } else {
        top_points = Number(interaction.options.get('toppoints')?.value)
    }

    try {
      let valid;
      valid = await GameResult.updateResponse(existingID, newMessage, newCategoryName, bottom_points, top_points );
      let content;
      if(valid){
        content = 'Response Updated'
      } else {
        content = 'Not able to find that Response'
      }


      await interaction.followUp({
        ephemeral: true,
        content
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Response Updated Successfully'))
      })
    } catch (err) {
      if (err && axios.isAxiosError(err) && err.response && err.response.data.message.includes('Duplicate entry')) {
        const content = 'You have already created this Response!'

        await interaction.followUp({
          ephemeral: true,
          content
        })

        return new Promise((resolve, reject) => {
          resolve(new LogResult(true, LogStatus.Incomplete, 'Response already created'))
        })
      } else {
        const content = 'Something went wrong, talk to Wock'

        await interaction.followUp({
          ephemeral: true,
          content
        })

        return new Promise((resolve, reject) => {
          reject(new LogResult(false, LogStatus.Error, 'General Response Command Error'))
        })
      }
    }
  }
}
