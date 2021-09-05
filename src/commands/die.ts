import { CommandInteraction } from "discord.js"
import { yargs, reply } from "../common"
import { config } from "../config"
import { setScene } from "../obs"

export default async (args: yargs.CommandArgs, interaction?: CommandInteraction): Promise<void> => {
  const argument = args.args._[0]
  try {
    await setScene(config.dieScene)
    reply(args, `**scene:** ${ argument }`, interaction)
  } catch (e) {
    console.error("Error :", e)
    reply(args, "There was an error setting the scene.", interaction)
  }
  return
}
