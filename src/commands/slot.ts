import { CommandInteraction } from "discord.js"
import { scene, slot } from "../common"
import { config } from "../config"

export default async (interaction: CommandInteraction): Promise<void> => {
  // console.log("interaction.options.data :", interaction.options.data)
  interaction.reply(JSON.stringify(interaction.options.data))

  const validSlots = Object.keys(config.slots)

  const selectedScene = interaction.options.data.find(o => o.name === "scene")
  const selectedSlots = interaction.options.data.filter(o => validSlots.includes(o.name))

  // console.log("selectedSlots :", selectedSlots)

  // const currentConfig = await getConfig.getConfigForCurrentScene()
  // getConfig.getTypeOfSceneFromScene()

  if (typeof selectedScene?.value === "string") {
    await scene.setSceneByArgument(selectedScene.value)
  }

  for (const slotArgument of selectedSlots) {
    const slotName = slotArgument.name
    const slotSource = slotArgument.value
    if (typeof slotSource !== "string") continue
    slot.setSlotSource(slotName, slotSource)
  }

  // handle slot assignments
  // handle scene switches

  // identify if should switch slots before or after scene switch based on the scene's configured slots
  return
}
