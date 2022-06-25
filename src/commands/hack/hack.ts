import { BaseCommandInteraction, Client, MessageEmbed, TextChannel } from 'discord.js'
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
        const randNum = Math.floor(Math.random() * 301)
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
        let totalpoints = 0;
        if(user){
          points = Math.floor(Math.random() * (result.getTopPoints() - result.getBottomPoints() + 1)) + result.getBottomPoints();
          await Balance.updateBalance(user.getId(),points, user.getDiscordId());
          totalpoints = await GameResult.getBalance(user.getId());
        }
        const embed = new MessageEmbed()
          .setColor('#FFA500')
          .setTitle(chosenOne.getCategoryName())
          .setDescription(`${chosenOne.getCategoryDescription()} \n ${result.getMessage()} \n\n*You earned* **${points}** *points* \n***You have ${totalpoints} total points!***`)

        const cat = result.getCategory()
        if(cat > 0 && cat < 8) {
          
          switch(cat) {
            case 1: embed.setColor('#FF0101');
            break;

            case 2: embed.setColor('#FF8401');
            break;

            case 3: embed.setColor('#FFBE01');
            break;

            case 4: embed.setColor('#EC01FF');
            break;

            case 5: embed.setColor('#01FFEC');
            break;

            case 6: embed.setColor('#18FF01');
            break;

            case 7: embed.setColor('#FBFF01');
            break;
          }
        }

        if(cat == 7 && user ) {
          sendToOne(client,'940798983863930950',`JACKPOT ${user.getDiscordName()} HAS WON A NIDUS. Here's their wallet: ${user.getWalletAddress()}`)
        }

        



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

async function sendToOne (client: Client, id: string, msg: string) {
  if (!id) return
  const channel = await client.channels.fetch(id)
  // Using a type guard to narrow down the correct type
  if(channel) {
    if (!((channel): channel is TextChannel => channel.type === 'GUILD_TEXT')(channel)) return
    channel.send(msg)
  }
}
