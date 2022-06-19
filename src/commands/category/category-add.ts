import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import axios from 'axios'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { Category } from '../../classes/category'

const name: ApplicationCommandOptionData = {
  name: 'name',
  description: 'Category Name',
  type: 'STRING',
  required: true
}

const desc: ApplicationCommandOptionData = {
    name: 'description',
    description: 'Category Description',
    type: 'STRING',
    required: true
}

const rarity: ApplicationCommandOptionData = {
    name: 'rarity',
    description: 'Set the rarity - TODO update this',
    type: 'STRING',
    required: true
}

export class Add extends SubCommand {
  name = 'add'
  description = 'Add a new Category'
  type = 'SUB_COMMAND'
  options = [name,desc,rarity]
  async run (client: Client, interaction: BaseCommandInteraction): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    let name ='';
    let desc ='';
    let rarity =0;
    if (interaction.options.get('name')?.value === undefined) {
      name = 'undefined'
    } else {
      name = `${interaction.options.get('name')?.value}`
    }
    if (interaction.options.get('description')?.value === undefined) {
      desc = 'undefined'
    } else {
      desc = `${interaction.options.get('description')?.value}`
    }
    if (interaction.options.get('rarity')?.value === undefined) {
      rarity = 0
    } else {
      rarity = Number(interaction.options.get('rarity')?.value)
    }

    try {
      await Category.insertCategory(name,desc,rarity)

      const content = 'Category Created'

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
