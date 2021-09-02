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

export const setSourceHidden = async (source: string, hidden: boolean): Promise<void> => {
  await obsSocket.send("SetSourceSettings", {
    sourceName: source,
    sourceSettings: {
      visible: hidden
    }
  })
}

export const getSourceSettings = async (source: string): Promise<void> => {
  await obsSocket.send("GetSourceSettings", {
    sourceName: source
  })
}
