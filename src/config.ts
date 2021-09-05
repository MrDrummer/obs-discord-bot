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
}

export interface SceneMappingSource extends SceneMappingBase {
  source: string
}

export interface SceneMappingLayouts extends SceneMappingBase {
  slots: string[]
}

export interface Config {
  dieScene: string
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
}

const file = fs.readFileSync(path.join(__dirname, "../config.yaml"), "utf8")
const config: Config = YAML.parse(file)

export {
  secrets,
  config,
  subscriber
}
