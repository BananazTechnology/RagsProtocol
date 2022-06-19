import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { User } from '../../classes/user'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { Category } from '../../classes/category'

export class View extends SubCommand {
  name = 'view'
  description = 'View categories'
  type = 'SUB_COMMAND'
  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    try {
      let categories = await Category.getAllCategories();
      categories = categories.sort((obj1, obj2) => {
      if (obj1.getRarity() > obj2.getRarity()) {
          return 1;
      }

      if (obj1.getRarity() < obj2.getRarity()) {
          return -1;
      }
          return 0;
      });
      let text = '';
      const embed = new MessageEmbed()
        .setColor('#FFA500')
        .setTitle(`Categories`)
        .setDescription(text);

        categories.forEach(category => {
            embed.addField(`${category.getId()}). ${category.getCategoryName()} - ${category.getRarity()}`, `${category.getCategoryDescription()}`)
        }) 

      await interaction.followUp({
        embeds: [embed]
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Category View Completed Successfully'))
      })
    } catch (err) {
      const content = 'Something went wrong'

      await interaction.followUp({
        ephemeral: true,
        content
      })

      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'General Category View Command Error'))
      })
    }
  }
}
