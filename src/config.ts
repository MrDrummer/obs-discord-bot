import secrets from "./secrets.json"
import YAML from "yaml"
import fs from "fs"
import path from "path"

export interface SceneMapping {
  arg: string // What is put into the command
  scene: string // Name for OBS
  desc: string // Description displayed within Discord.
}

export interface Config {
  sources: SceneMapping[]
  layouts: SceneMapping[]
  slots: Record<string, string>
}

const file = fs.readFileSync(path.join(__dirname, "./config.yaml"), "utf8")
const config: Config = YAML.parse(file)

export {
  secrets,
  config
}
