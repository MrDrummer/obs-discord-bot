import { Client, Intents, Channel, TextChannel } from "discord.js"
import config from "./config.json"
let botClient: Client
export default (): Promise<Client> => {
  return new Promise((resolve, reject) => {
    let connected = false
    const client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],

      presence: {
        activities: [
          {
            type: "WATCHING",
            name: "for scene switches"
          }
        ]
      },
      partials: [
        "MESSAGE",
        "CHANNEL"
      ]
    })
    client.login(config.discord.token)

    const timeout = setTimeout(function () {
      if (!connected) reject("Aborted connection to Discord.")
    }, 20000)
    client.on("ready", () => {
      console.log(`Logged in as "${ client.user?.username }"!`)
      botClient = client
      connected = false
      clearTimeout(timeout)
      resolve(client)
    })

    client.on("error", e => {
      console.error("Discord had an error:", e)
    })
  })
}

export const getGuildTextChannel = async (channelId: string): Promise<(Channel & TextChannel) | null> => {
  const channel = await botClient.channels.fetch(channelId)
  if (channel?.type === "GUILD_TEXT" && channel.isText() && (channel instanceof TextChannel)) {
    return channel
  } else {
    console.log(`Channel ID ${ channelId } isn't a Discord Guild text channel.`)
    return null
  }
}
