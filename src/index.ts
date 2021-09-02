import startObs from "./obs"
import startDiscord, { getGuildTextChannel } from "./discord"
import { secrets } from "./config"
import { commands } from "./commands"

const serverName = secrets.meta.name

const start = async (): Promise<void> => {
  console.log(`Bot startup at ${ new Date().toISOString() }`)
  const obs = await startObs()
  console.log("Started OBS")
  const bot = await startDiscord()
  console.log("Started Discord")

  const scenes = await obs.send("GetSceneList")
  const validScenes = scenes.scenes.map(s => s.name)

  const channel = await getGuildTextChannel(secrets.discord.channels.log)
  channel?.send(`[${ serverName }] started with **${ validScenes.length }** scenes.`)
  console.log("ready")


  bot.on("interactionCreate", async (interaction): Promise<void> => {
    if (!interaction.isCommand()) return

    await commands[interaction.commandName]?.(interaction)
    return
  })
}

start()
