import ObsWebSocket from "obs-websocket-js"

export interface ObsBase {
  messageId: string
  status: "ok"
}

export interface CurrentScene extends ObsBase {
  name: string
  sources: ObsWebSocket.SceneItem[]
}

export interface GetAudioTracks extends ObsBase {
  track1: boolean
  track2: boolean
  track3: boolean
  track4: boolean
  track5: boolean
  track6: boolean
}

export interface GetAudioActive extends ObsBase {
  audioActive: boolean
}

export interface GetVolume extends ObsBase {
  name: string
  volume: number
  muted: boolean
}
export interface GetMuted extends ObsBase {
  name: string
  muted: boolean
}

export interface GetSources extends ObsBase {
  sources: {
    name: string
    typeId: string
    type: string
  }[]
}

export interface GetSceneItems extends ObsBase {
  sceneName: string
  sceneItems: {
    itemId: number
    sourceKind: string
    sourceName: string
    sourceType: string
  }[]
}
