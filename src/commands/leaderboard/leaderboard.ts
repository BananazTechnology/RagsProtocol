import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { User } from '../../classes/user'
import { Command } from '../../interfaces/command'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { Balance } from '../../classes/balance'

export class Leaderboard extends Command {
  name = 'leaderboard'
  description = 'Check out the competition'
  type = 'CHAT_INPUT'

  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    try {
      await interaction.deferReply({ ephemeral: true })
      let leaderboard = await Balance.getLeaderboard()
      let top15 = '```';
      for(let i = 0; i < 15; i++) {
        if(leaderboard[i]){
            const lUser = await User.getByDiscordId(leaderboard[i].getDiscordID());
            if(lUser) {
                top15+= `${i + 1}). ${lUser.getDiscordName()} - ${leaderboard[i].getPoints()}\n`
            }
        }
      }

      const index = leaderboard.findIndex(entry => entry.getDiscordID() == user?.getDiscordId());
      top15 += `\n\n${index + 1}). You - ${leaderboard[index].getPoints()}`
      top15 += '```';

      const embed = new MessageEmbed()
          .setColor('#FFA500')
          .setTitle(`LEADERBOARD -----------------------`)
          .setDescription(`${top15}`)

      await interaction.followUp({
        embeds: [embed]
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Leaderboard Command Completed Successfully'))
      })
    } catch {
      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'Leaderboard Command Error'))
      })
    }
  }
}
