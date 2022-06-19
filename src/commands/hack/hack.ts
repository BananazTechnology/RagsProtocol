import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { Category } from '../../classes/category'
import { GameResult } from '../../classes/gameResult'
import { Balance } from '../../classes/balance'

export class Hack extends Command {
  name = 'hack'
  description = 'try your luck!'
  type = 'CHAT_INPUT'
  cooldown = .01

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply()
    if (!await user?.checkRole(984278979257184286n, interaction)) {
      await interaction.followUp({
        content: 'You don\'t have permission the play the game'
      })
      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Warn, 'User had insignifficant permissions'))
      })
    } else {
      try {
        const randNum = Math.floor(Math.random() * 100)
        let categories = await Category.getAllCategories()
        let previousRarity = 0
        let chosenOne: Category|undefined
        categories = categories.sort((obj1, obj2) => {
          if (obj1.getRarity() > obj2.getRarity()) {
              return 1;
          }
      
          if (obj1.getRarity() < obj2.getRarity()) {
              return -1;
          }
      
          return 0;
        });
        categories.forEach(category => {
          if ((randNum >= previousRarity) && (randNum <= category.getRarity())) {
            chosenOne = category
            previousRarity = category.getRarity()
          };
        })

        if (!chosenOne) {
          await interaction.followUp({
            content: 'Somtin not workin. We look into it ;)'
          })
          return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Error, 'ChosenOne variable was undefined'))
          })
        }

        const result = await GameResult.getGameResult(chosenOne.getId())

        if (!result) {
          await interaction.followUp({
            content: 'Whaaat?! IDK what happend. We will look into it!'
          })
          return new Promise((resolve, reject) => {
            resolve(new LogResult(true, LogStatus.Error, 'result variable was undefined'))
          })
        }
        let points = 0;
        if(user){
          points = Math.floor(Math.random() * (result.getTopPoints() - result.getBottomPoints() + 1)) + result.getBottomPoints();
          Balance.updateBalance(user.getId(),points, user.getDiscordId());
        }
        const embed = new MessageEmbed()
          .setColor('#FFA500')
          .setTitle(chosenOne.getCategoryName())
          .setDescription(`${chosenOne.getCategoryDescription()} \n ${result.getMessage()} \n\n*You earned* **${points}** *points*`)


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
