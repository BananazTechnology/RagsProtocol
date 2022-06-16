import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { Category } from '../../classes/category'
import { GameResult } from '../../classes/gameResult'

export class Hack extends Command {
  name = 'hack'
  description = 'try your luck!'
  type = 'CHAT_INPUT'
  cooldown = 2

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply()
    if (!await user.checkRole(984278979257184286n, interaction)) {
      await interaction.followUp({
        content: 'You don\'t have permission the play the game'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Warn, 'User had insignifficant permissions'))
      })
    } else {
      try {
        const randNum = Math.floor(Math.random() * 100)
        const categories = await Category.getAllCategories();
        let previousRarity = 0;
        let chosenOne;
        categories.forEach(category => {
            if((randNum >= previousRarity) && (randNum <= category.getRarity())){
                chosenOne = category;
            };
        });
        let result = await GameResult.getGameResult(chosenOne.getId());

        const embed = new MessageEmbed()
          .setColor('#FFA500')
          .setTitle(chosenOne.getCategoryName())
          .setDescription(`${chosenOne.getCategoryDescription()} \n ${result.getMessage()}`)

        console.log(JSON.stringify(result))

        await interaction.followUp({
          embeds: [embed]
        })

        return new Promise((resolve, reject) => {
          resolve(new LogResult(true, LogStatus.Success, 'Hack Command Completed Successfully'))
        })
      } catch (e) {
        console.log(e)
        return new Promise((resolve, reject) => {
          reject(new LogResult(false, LogStatus.Error, 'Hack Command Error'))
        })
      }
    }
  }
}

