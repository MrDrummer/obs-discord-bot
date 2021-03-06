import startObs from "./obs/socket"
import startDiscord, { getGuildTextChannel } from "./discord"
import startPubSub from "./pubsub"
import startHttp from "./http"
import { secrets } from "./config"

const serverName = secrets.meta.name

const start = async (): Promise<void> => {
  console.log(`Bot startup at ${ new Date().toISOString() }`)
  const obs = await startObs()
  console.log("Started OBS")
  await startDiscord()
  console.log("Started Discord")
  if (secrets.pubsub?.subscriber) {
    startPubSub()
    console.log("Started PubSub")
  }
  if (secrets.http.port) {
    startHttp()
    console.log("Started HTTP Server")
  }

  const scenes = await obs.send("GetSceneList")
  const validScenes = scenes.scenes.map(s => s.name)

  const channel = await getGuildTextChannel(secrets.discord.channels.log)
  channel?.send(`[${ serverName }] started with **${ validScenes.length }** scenes.`)
  console.log("Ready")
}

start()
