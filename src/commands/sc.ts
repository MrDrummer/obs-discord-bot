import { CommandInteraction } from "discord.js"
import { scene } from "../common"

export default async (interaction: CommandInteraction): Promise<void> => {
  const argument = interaction.options.data[0]
  try {
    if (argument.type === "SUB_COMMAND") {
      await scene.setSceneByArgument(argument.name)
      interaction.reply(`**scene:** ${ argument.name }`)
    } else {
      throw new Error()
    }
  } catch (e) {
    console.error("Error :", e)
    interaction.reply("There was an error setting the scene.")
  }
  return
}
