import yargs from "yargs-parser"
import { commands } from "../commands"

export interface RemoteData {
  identity: string
  rawCommand: string
}

export const parseAndExecuteRemoteCommand = async (data: RemoteData): Promise<void> => {
  const command = data.rawCommand.split(" ")[0]
  const argsString = data.rawCommand.split(" ").slice(1).join(" ").trim()
  const args = yargs(argsString, {
    configuration: {
      "short-option-groups": false
    }
  })

  await commands[command]?.({
    source: "external",
    args,
    identity: data.identity
  })

}
