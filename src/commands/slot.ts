import { CommandInteraction } from "discord.js"
import { scene } from "../common" // getConfig
import { config } from "../config"

export default async (interaction: CommandInteraction): Promise<void> => {
  await console.log("interaction.options.data :", interaction.options.data)
  interaction.reply(JSON.stringify(interaction.options.data))

  const validSlots = Object.keys(config.slots)

  const selectedScene = interaction.options.data.find(o => o.name === "scene")
  const selectedSlots = interaction.options.data.filter(o => validSlots.includes(o.name))

  console.log("selectedSlots :", selectedSlots)

  if (scene && typeof selectedScene?.value === "string") {
    scene.setSceneByArgument(selectedScene.value)
  }


  // getConfig.getTypeOfSceneFromArg(argument.name) // to determine which order to handle scene AND slot changes


  // handle slot assignments
  // handle scene switches

  // identify if should switch slots before or after scene switch based on the scene's configured slots
  return
}
