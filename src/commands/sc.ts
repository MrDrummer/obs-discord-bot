import { CommandInteraction } from "discord.js"
import { scene, yargs, reply } from "../common"

export default async (args: yargs.CommandArgs, interaction?: CommandInteraction): Promise<void> => {
  const argument = args.args._[0]
  try {
    await scene.setSceneByArgument(argument)
    reply(args, `**scene:** ${ argument }`, interaction)
  } catch (e) {
    console.error("Error :", e)
    reply(args, "There was an error setting the scene.", interaction)
  }
  return
}
