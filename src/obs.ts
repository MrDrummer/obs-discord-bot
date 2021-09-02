import ObsWebSocket from "obs-websocket-js"
import { secrets } from "./config"

export let obsSocket: ObsWebSocket

export default async (): Promise<ObsWebSocket> => {
  try {
    const obs = new ObsWebSocket()
    obsSocket = obs
    await obs.connect({
      address: `${ secrets.obs.hostname }:${ secrets.obs.port }`,
      password: secrets.obs.password
    })
    return obs
  } catch (e) {
    console.error(e)
    throw new Error("Couldn't connect to OBS. Is it running?")
  }
}

export const setScene = (scene: string): Promise<void> => {
  return obsSocket.send("SetCurrentScene", { "scene-name": scene })
}

interface CurrentScene {
  messageId: string
  status: "ok"
  name: string
  sources: ObsWebSocket.SceneItem[]
}

export const getCurrentScene = (): Promise<CurrentScene> => {
  return obsSocket.send("GetCurrentScene")
}
