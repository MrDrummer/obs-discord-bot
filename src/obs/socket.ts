import ObsWebSocket from "obs-websocket-js"
import { secrets } from "../config"
import { CurrentScene, GetAudioActive, GetAudioTracks, GetMuted, GetSceneItems, GetSources, GetVolume } from "./types"

export let obsSocket: ObsWebSocket

export default async (): Promise<ObsWebSocket> => {
  try {
    const obs = new ObsWebSocket()
    obsSocket = obs
    await obs.connect(
      `${ secrets.obs.hostname }:${ secrets.obs.port }`,
      secrets.obs.password
    )
    return obs
  } catch (e) {
    console.error(e)
    throw new Error("Couldn't connect to OBS. Is it running?")
  }
}

export const setScene = (scene: string): Promise<void> => {
  return obsSocket.call("SetCurrentProgramScene", {
    sceneName: scene
  })
}

export const getCurrentScene = (): Promise<CurrentScene> => {
  return obsSocket.call("GetCurrentProgramScene")
}

export const startStream = (): Promise<void> => {
  return obsSocket.call("StartStreaming", {})
}

export const endStream = (): Promise<void> => {
  return obsSocket.call("StopStreaming")
}

export const getAudioTracks = (sourceName: string): Promise<GetAudioTracks> => {
  return obsSocket.call("GetTracks", { sourceName })
}

export const getAudioActive = (sourceName: string): Promise<GetAudioActive> => {
  return obsSocket.call("GetAudioActive", { sourceName })
}

export const getVolume = (sourceName: string, useDecibel: boolean): Promise<GetVolume> => {
  return obsSocket.call("GetVolume", { source: sourceName, useDecibel })
}

export const setVolume = (sourceName: string, volume: number, useDecibel: boolean): Promise<void> => {
  return obsSocket.call("SetVolume", { source: sourceName, volume, useDecibel })
}

export const getMute = (sourceName: string): Promise<GetMuted> => {
  return obsSocket.call("GetMute", { source: sourceName })
}

export const setMute = (sourceName: string, mute: boolean): Promise<void> => {
  return obsSocket.call("SetMute", { source: sourceName, mute })
}

export const getSources = (): Promise<GetSources> => {
  return obsSocket.call("GetSourcesList")
}

export const getSceneItemList = (sceneName?: string): Promise<GetSceneItems> => {
  return obsSocket.call("GetSceneItemList", { sceneName })
}

export const setSceneSourceVisibility = (scene: string, source: string, render: boolean): Promise<void> => {
  // console.log("scene, source, render :", scene, source, render)
  return obsSocket.call("SetSceneItemRender", {
    "scene-name": scene,
    source,
    render
  })
}
