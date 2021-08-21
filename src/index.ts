import startObs from "./obs"
import startDiscord from "./discord"

const start = async (): Promise<void> => {
  const obs = await startObs()
  console.log("Started OBS")
  const bot = await startDiscord()
  console.log("Started Discord")

  const scenes = await obs.send("GetSceneList")
  // console.log("Scenes :", scenes)

  const validScenes = scenes.scenes.map(s => s.name)

  // console.log("Scene Options :", validScenes)

  bot.on("messageCreate", async message => {
    const scene = message.content
    if (validScenes.includes(scene)) {
      await setScene(scene).catch(console.error)
    } else if (scene.startsWith("!scenes")) {
      message.channel.send(`Valid scenes are as follows:\n${ validScenes.join("\n") }`)
    } else if (scene.startsWith("!collection")) {
      const collections = await obs.send("ListSceneCollections")
      message.channel.send(`Valid collections are as follows:\n${ collections["scene-collections"].map(c => c["sc-name"]).join("\n") }`)
    }
  })

  const setScene = (scene: string): Promise<void> => {
    return obs.send("SetCurrentScene", { "scene-name": scene })
  }
}

start()
