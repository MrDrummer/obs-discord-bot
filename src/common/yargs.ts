import { CommandInteraction } from "discord.js"
import { Arguments } from "yargs-parser"

export const interactionToYargs = (interaction: CommandInteraction): CommandArgs => {

  const yargsArgs: Partial<Arguments> = {}
  yargsArgs._ = []
  for (const arg of interaction.options.data) {
    if (arg.type === "SUB_COMMAND") {
      yargsArgs._.push(arg.name)
      if (arg.options) {
        for (const sub of arg.options) {
          yargsArgs[sub.name] = sub.value
        }
      }
    } else if (arg.type === "STRING") {
      yargsArgs[arg.name] = arg.value
    }
  }

  return {
    source: "discord",
    args: yargsArgs as Arguments,
    identity: interaction.user.username
  }
}

export interface CommandArgs {
  source: "discord" | "external"
  args: Arguments
  identity: string
}
