import { CommandInteraction } from "discord.js"
import { yargs, reply } from "../common"
import { config } from "../config"
import { startStream, endStream } from "../obs"

export default async (args: yargs.CommandArgs, interaction?: CommandInteraction): Promise<void> => {
  try {
    const command = args.args._[0]
    if (command === "start" && config.allowStart) {
      await startStream()
    } else if (command === "stop" && config.allowStop) {
      await endStream()
    } else {
      throw new Error("stream command needs an argument")
    }

    reply(args, `**stream:** ${ command }`, interaction)
  } catch (e) {
    console.error("Error :", e)
    reply(args, "There was an error setting the scene.", interaction)
  }
  return
}
