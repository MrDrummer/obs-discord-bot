import { CommandInteraction } from "discord.js"
import { yargs, reply } from "../common"
import { config } from "../config"
import { setScene } from "../obs"

export default async (args: yargs.CommandArgs, interaction?: CommandInteraction): Promise<void> => {
  try {
    await setScene(config.dieScene)
    reply(args, `**scene:** ${ config.dieScene }`, interaction)
  } catch (e) {
    console.error("Error :", e)
    reply(args, "There was an error setting the scene.", interaction)
  }
  return
}
