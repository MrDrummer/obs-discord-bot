import { Client, Intents } from "discord.js"
import config from "./config.json"

export default (): Promise<Client> => {
  return new Promise((resolve) => {
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
        "MESSAGE"
      ]
    })
    client.login(config.discord.token)
    client.on("ready", () => {
      console.log(`Logged in as "${ client.user?.username }"!`)
      resolve(client)
    })
  })
}
