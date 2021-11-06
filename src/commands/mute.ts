import { CommandInteraction } from "discord.js"
import { yargs, reply } from "../common"
import { setMute } from "../obs/socket"
// import { config } from "../config"
// import { setScene } from "../obs"

export default async (yargs: yargs.CommandArgs, interaction?: CommandInteraction): Promise<void> => {
  try {
    const args = yargs.args
    await setMute(args.source, true)
    reply(yargs, `**muted:** ${ args.source }`, interaction)

  } catch (e) {
    console.error("Error :", e)
    reply(yargs, "There was an error setting the scene.", interaction)
  }
  return
}
