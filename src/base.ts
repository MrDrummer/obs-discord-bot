import { CommandInteraction } from "discord.js"
import { CommandArgs } from "./common/yargs"

export type RunFunction = (args: CommandArgs, commandArguments?: CommandInteraction) => Promise<void>
export type Commands = Record<string, RunFunction>
