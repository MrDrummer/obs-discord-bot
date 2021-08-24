import ObsWebSocket from "obs-websocket-js"
import { secrets } from "./config"
export default async (): Promise<ObsWebSocket> => {
  try {
    const obs = new ObsWebSocket()
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
