import { CommandInteraction } from "discord.js"

export type RunFunction = (commandArguments: CommandInteraction) => Promise<void>
export type Commands = Record<string, RunFunction>
