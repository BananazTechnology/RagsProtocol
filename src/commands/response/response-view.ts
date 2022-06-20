import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { User } from '../../classes/user'
import { LogResult } from '../../classes/logResult'
import { LogStatus } from '../../resources/logStatus'
import { GameResult } from '../../classes/gameResult'

export class View extends SubCommand {
  name = 'view'
  description = 'View responses'
  type = 'SUB_COMMAND'
  async run (client: Client, interaction: BaseCommandInteraction, user?: User): Promise<LogResult> {
    await interaction.deferReply({ ephemeral: true })

    try {
      let responses = await GameResult.getAllResponses();
      const embed = new MessageEmbed()
        .setColor('#FFA500')
        .setTitle(`Categories`)

        responses.forEach(response => {
            embed.addField(`${response.getId()}). ${response.getMessage()}`, `${response.getBottomPoints()} -${response.getTopPoints()}`)
        }) 

      await interaction.followUp({
        embeds: [embed]
      })

      return new Promise((resolve, reject) => {
        resolve(new LogResult(true, LogStatus.Success, 'Response View Completed Successfully'))
      })
    } catch (err) {
      const content = 'Something went wrong'

      await interaction.followUp({
        ephemeral: true,
        content
      })

      return new Promise((resolve, reject) => {
        reject(new LogResult(false, LogStatus.Error, 'General Response View Command Error'))
      })
    }
  }
}
