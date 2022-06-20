import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import axios from 'axios'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { GameResult } from '../../classes/gameResult'
import { Category } from '../../classes/category'

const message: ApplicationCommandOptionData = {
  name: 'message',
  description: 'Response Message',
  type: 'STRING',
  required: true
}

const category_name: ApplicationCommandOptionData = {
    name: 'category_name',
    description: 'Category Name',
    type: 'STRING',
    required: true
}

const bottom_points: ApplicationCommandOptionData = {
    name: 'bottom_points',
    description: 'Set the bottom range of the points',
    type: 'NUMBER',
    required: true
}

const top_points: ApplicationCommandOptionData = {
    name: 'top_points',
    description: 'Set the top range of the points',
    type: 'NUMBER',
    required: true
}

export class Add extends SubCommand {
  name = 'add'
  description = 'Add a new Response'
  type = 'SUB_COMMAND'
  options = [message,category_name,bottom_points,top_points]
  async run (client: Client, interaction: BaseCommandInteraction): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    let message ='';
    let category_name ='';
    let bottom_points =0;
    let top_points = 0;

    if (interaction.options.get('message')?.value === undefined) {
      message = 'undefined'
    } else {
      message = `${interaction.options.get('message')?.value}`
    }

    if (interaction.options.get('category_name')?.value === undefined) {
      category_name = 'undefined'
    } else {
      category_name = `${interaction.options.get('category_name')?.value}`
    }

    if (interaction.options.get('bottom_points')?.value === undefined) {
      bottom_points = 0
    } else {
      bottom_points = Number(interaction.options.get('bottom_points')?.value)
    }

    if (interaction.options.get('top_points')?.value === undefined) {
      top_points = 0
    } else {
      top_points = Number(interaction.options.get('top_points')?.value)
    }
    const category = await Category.getCategoryByName(category_name);
    console.log(category);
    let category_id = -1;
    if(category){
        category_id = category.getId();
    }

    try {
    
      if(category_id < 1) {
        const content = 'Incorrect Category ID'
        await interaction.followUp({
            ephemeral: true,
            content
          })
          return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Success, 'Unable to resolve Category on response add Successfully'))
          })
      } else {
        await GameResult.addResponse(message,category_id,bottom_points,top_points)
        const content = 'Response Created'
        await interaction.followUp({
          ephemeral: true,
          content
        })
        return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Success, 'Response Created Successfully'))
          })
      }
    

      
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
          reject(new LogResult(false, LogStatus.Error, 'General Response Create Command Error'))
        })
      }
    }
  }
}
