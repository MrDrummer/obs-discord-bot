import ObsWebSocket from "obs-websocket-js"
import config from "./config.json"
export default async (): Promise<ObsWebSocket> => {
  try {
    const obs = new ObsWebSocket()
    await obs.connect({
      address: `${ config.obs.hostname }:${ config.obs.port }`,
      password: config.obs.password
    })
    return obs
  } catch (e) {
    console.error(e)
    throw new Error("Couldn't connect to OBS. Is it running?")
  }
}
