// eslint-disable-next-line @typescript-eslint/no-var-requires
const secrets: Secrets = require("../secrets.json")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const subscriber = require("../subscriber.secrets.json")
// import secrets from "../secrets.json"
import YAML from "yaml"
import fs from "fs"
import path from "path"

export interface SceneMappingBase {
  arg: string // What is put into the command
  scene: string // Name for OBS
  desc: string // Description displayed within Discord.
  audio: string // Audio source only visible when this scene or slot is visible
  hideScene: boolean // Hide the source from scene selection - only show in slots
  hideSlot: boolean // Hide the source from slot selection - only show in scenes
}

export interface SceneMappingSource extends SceneMappingBase {
  source: string
}

export interface SceneMappingLayouts extends SceneMappingBase {
  slots: string[]
}

export interface Config {
  dieScene: string
  allowStart: boolean
  allowStop: boolean
  globalAudio: string[]
  sources: SceneMappingSource[]
  layouts: SceneMappingLayouts[]
  slots: Record<string, string>
}

export interface Secrets {
  discord: {
    token: string
    clientId: string
    guildId: string
    channels: {
      main: string
      log: string
    }
  }
  obs: {
    hostname: string
    port: string
    password: string
  }
  meta: {
    name: string
    notes: string
  }
  pubsub: {
    subscriber: string
  }
  http: {
    port: number
  }
}

export interface UserToken {
  username: string
  token: string
}

export interface UserTokenConfig {
  users: UserToken[]
}

const file = fs.readFileSync(path.join(__dirname, "../config.yaml"), "utf8")
const config: Config = YAML.parse(file)

const tokens = fs.readFileSync(path.join(__dirname, "../user.tokens.yaml"), "utf8")
const users: UserTokenConfig = YAML.parse(tokens)

export {
  secrets,
  config,
  subscriber,
  users
}
