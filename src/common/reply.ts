import { CommandInteraction, Message } from "discord.js"
import { secrets } from "../config"
import { getGuildTextChannel } from "../discord"
import { CommandArgs } from "./yargs"

export const reply = async (args: CommandArgs, message: string, interaction?: CommandInteraction): Promise<Message | undefined | void> => {
  if (args.source === "discord" && interaction) {
    return interaction.reply(`${ args.identity }:\n${ message }`)
  } else if (args.source === "external") {
    const postToChannel = await getGuildTextChannel(secrets.discord.channels.main)
    if (!postToChannel) return
    return postToChannel?.send(`${ args.identity }:\n${ message }`)
  }
}
