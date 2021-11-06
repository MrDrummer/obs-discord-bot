import ObsWebSocket from "obs-websocket-js"
import { secrets } from "../config"
import { CurrentScene, GetAudioActive, GetAudioTracks, GetMuted, GetSceneItems, GetSources, GetVolume } from "./types"

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

export const getCurrentScene = (): Promise<CurrentScene> => {
  return obsSocket.send("GetCurrentScene")
}

export const startStream = (): Promise<void> => {
  return obsSocket.send("StartStreaming", {})
}

export const endStream = (): Promise<void> => {
  return obsSocket.send("StopStreaming")
}

export const getAudioTracks = (sourceName: string): Promise<GetAudioTracks> => {
  return obsSocket.send("GetTracks", { sourceName })
}

export const getAudioActive = (sourceName: string): Promise<GetAudioActive> => {
  return obsSocket.send("GetAudioActive", { sourceName })
}

export const getVolume = (sourceName: string, useDecibel: boolean): Promise<GetVolume> => {
  return obsSocket.send("GetVolume", { source: sourceName, useDecibel })
}

export const setVolume = (sourceName: string, volume: number, useDecibel: boolean): Promise<void> => {
  return obsSocket.send("SetVolume", { source: sourceName, volume, useDecibel })
}

export const getMute = (sourceName: string): Promise<GetMuted> => {
  return obsSocket.send("GetMute", { source: sourceName })
}

export const setMute = (sourceName: string, mute: boolean): Promise<void> => {
  return obsSocket.send("SetMute", { source: sourceName, mute })
}

export const getSources = (): Promise<GetSources> => {
  return obsSocket.send("GetSourcesList")
}

export const getSceneItemList = (sceneName?: string): Promise<GetSceneItems> => {
  return obsSocket.send("GetSceneItemList", { sceneName })
}

export const setSceneSourceVisibility = (scene: string, source: string, render: boolean): Promise<void> => {
  // console.log("scene, source, render :", scene, source, render)
  return obsSocket.send("SetSceneItemRender", {
    "scene-name": scene,
    source,
    render
  })
}
