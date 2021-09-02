import { CommandInteraction } from "discord.js"
import { scene } from "../common"

export default async (interaction: CommandInteraction): Promise<void> => {
  await console.log("interaction.options.data :", interaction.options.data)
  interaction.reply(JSON.stringify(interaction.options.data))
  const argument = interaction.options.data[0]
  if (argument.type === "SUB_COMMAND") {
    await scene.setSceneByArgument(argument.name)
  }
  return
}
