import startObs from "./obs"
import startDiscord, { getGuildTextChannel } from "./discord"
import { secrets } from "./config"

const serverName = secrets.meta.name

const start = async (): Promise<void> => {
  console.log(`Bot startup at ${ new Date().toISOString() }`)
  const obs = await startObs()
  console.log("Started OBS")
  const bot = await startDiscord()
  console.log("Started Discord")

  const scenes = await obs.send("GetSceneList")
  // console.log("Scenes :", scenes)

  const validScenes = scenes.scenes.map(s => s.name)

  const channel = await getGuildTextChannel(secrets.discord.channels.log)
  channel?.send(`[${ serverName }] started with **${ validScenes.length }** scenes.`)

  // console.log("Scene Options :", validScenes)

  bot.on("messageCreate", async message => {
    const scene = message.content
    if (validScenes.includes(scene)) {
      await setScene(scene).catch(console.error)
      message.channel.send(`Set the scene to ${ scene }`)

      // Audit log for other discord input methods
      // const logChannel = await getGuildTextChannel(secrets.discord.channels.log)
      // logChannel?.send(`${ message.member?.displayName } set the scene for ${ serverName } to ${ scene }`)

    } else if (scene.startsWith("!scenes")) {
      message.channel.send(`Valid scenes are as follows:\n${ validScenes.join("\n") }`)
    } else if (scene.startsWith("!ck")) {
      message.channel.send(`SBLControl on **${ serverName }** is listening.`)
    }
  })

  bot.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return

    console.log("interaction :", interaction.options)

    interaction.reply(JSON.stringify(interaction.options))
  })

  const setScene = (scene: string): Promise<void> => {
    return obs.send("SetCurrentScene", { "scene-name": scene })
  }
}

start()
// foo
