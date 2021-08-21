import ObsWebSocket from "obs-websocket-js"
import config from "./config.json"
export default async (): Promise<ObsWebSocket> => {
  const obs = new ObsWebSocket()
  await obs.connect({
    address: `${ config.obs.hostname }:${ config.obs.port }`,
    password: config.obs.password
  })
  return obs
}
