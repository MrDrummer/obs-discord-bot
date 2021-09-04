import { CommandInteraction } from "discord.js"
import { scene, slot, yargs, reply } from "../common"
import { config } from "../config"

export default async (args: yargs.CommandArgs, interaction?: CommandInteraction): Promise<void> => {
  // console.log("interaction.options.data :", interaction.options.data)

  const validSlots = Object.keys(config.slots)

  console.log("args :", args)

  const selectedScene = Object.entries(args.args).find(a => a[0] === "scene")?.[1]
  const selectedSlots = Object.entries(args.args).filter(s => validSlots.includes(s[0])).map(s => ({ name: s[0], value: s[1] }))

  console.log("selectedSlots :", selectedSlots)

  // const currentConfig = await getConfig.getConfigForCurrentScene()
  // getConfig.getTypeOfSceneFromScene()

  try {
    if (typeof selectedScene?.value === "string") {
      await scene.setSceneByArgument(selectedScene.value)
    }

    for (const slotArgument of selectedSlots) {
      const slotName = slotArgument.name
      const slotSource = slotArgument.value
      if (typeof slotSource !== "string") continue
      await slot.setSlotSource(slotName, slotSource)
    }

    const response = []
    if (selectedScene) response.push(`**scene:** ${ selectedScene }`)
    response.push(...selectedSlots.map(o => `**${ o.name }:** ${ o.value }`))

    reply(args, response.join("\n") || "No arguments provided.", interaction)
  } catch (e) {
    console.error("Error :", e)
    reply(args, "There was an error setting the scene or slots.", interaction)
  }

  // handle slot assignments
  // handle scene switches

  // identify if should switch slots before or after scene switch based on the scene's configured slots
  return
}
