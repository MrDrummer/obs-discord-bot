import { Client, Intents, Channel, TextChannel } from "discord.js"
import { REST } from "@discordjs/rest"
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9"
import { secrets, config } from "./config"
import { SlashCommandBuilder } from "@discordjs/builders"
import { yargs } from "./common"
import { commands } from "./commands"

let botClient: Client

interface BuiltCommand {
  name: string
  description: string
  options: APIApplicationCommandOption[]
  default_permission?: boolean
}

const rest = new REST({ version: "9" }).setToken(secrets.discord.token)

export default (): Promise<Client> => {
  return new Promise((resolve, reject) => {
    let connected = false
    const client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
      ],
      presence: {
        activities: [
          {
            type: "WATCHING",
            name: "for scene switches"
          }
        ]
      },
      partials: [
        "MESSAGE",
        "CHANNEL"
      ]
    })
    client.login(secrets.discord.token)

    const timeout = setTimeout(function () {
      if (!connected) reject("Aborted connection to Discord.")
    }, 20000)
    client.on("ready", async () => {
      console.log(`Logged in as "${ client.user?.username }"!`)
      botClient = client
      await refreshSlashCommands()
      connected = true
      clearTimeout(timeout)
      resolve(client)
    })

    client.on("error", e => {
      console.error("Discord had an error:", e)
    })

    client.on("interactionCreate", async (interaction): Promise<void> => {
      if (!interaction.isCommand()) return

      const result = yargs.interactionToYargs(interaction)

      await commands[interaction.commandName]?.(result, interaction)
      return
    })
  })
}

export const getGuildTextChannel = async (channelId: string): Promise<(Channel & TextChannel) | null> => {
  const channel = await botClient.channels.fetch(channelId)
  if (channel?.type === "GUILD_TEXT" && channel.isText() && (channel instanceof TextChannel)) {
    return channel
  } else {
    console.log(`Channel ID ${ channelId } isn't a Discord Guild text channel.`)
    return null
  }
}
// console.log("config :", config)
export const buildSlashCommands = (disabledCameras?: string[]): BuiltCommand[] => {
  const streamBuilder = new SlashCommandBuilder()
    .setName("stream")
    .setDescription("Starts or Stops the stream")
  streamBuilder.addSubcommand(sc => {
    return sc.setName("start")
      .setDescription("Starts the stream")
  })
  streamBuilder.addSubcommand(sc => {
    return sc.setName("stop")
      .setDescription("Stops the stream")
  })

  const sceneBuilder = new SlashCommandBuilder()
    .setName("sc")
    .setDescription("Set the active scene.");
  [...config.sources, ...config.layouts].forEach(c => {
    // console.log("sc :", c.arg)
    if (c.hideScene || (disabledCameras && disabledCameras.includes(c.scene))) return
    sceneBuilder.addSubcommand(sc => {
      // console.log("sc arg :", c.arg)
      return sc.setName(c.arg)
        .setDescription(c.desc)
    })
  })
  const slotBuilder = new SlashCommandBuilder()
    .setName("slot")
    .setDescription("Changes a slots's source.")
    .addStringOption(option => {
      const subcommand = option.setName("scene")
        .setDescription("Set the active scene.");
      [...config.sources, ...config.layouts].forEach(c => {
        if (c.hideScene || (disabledCameras && disabledCameras.includes(c.scene))) return
        subcommand.addChoice(c.arg, c.arg)
      })
      return subcommand
    })
  Object.keys(config.slots).forEach(key => {
    slotBuilder
      .setDescription(`Interacts with the ${ key } slot.`)
      .addStringOption(option => {
        const subcommand = option.setName(key)
          .setDescription("The source to assign to the slot.")
        config.sources.forEach(s => {
          if (s.hideSlot) return
          subcommand.addChoice(s.arg, s.arg)
        })
        return subcommand
      })
  })
  const pingCommand = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns ping time")
  const dieCommand = new SlashCommandBuilder()
    .setName("die")
    .setDescription("Cuts to the hold screen")
  return [
    sceneBuilder,
    slotBuilder,
    pingCommand,
    dieCommand,
    streamBuilder
  ].map(c => c.toJSON())
}

export const setSlashCommands = async (commands: BuiltCommand[]): Promise<void> => {
  await rest.put(
    Routes.applicationGuildCommands(secrets.discord.clientId, secrets.discord.guildId),
    {
      body: commands
    }
  )
}

export const refreshSlashCommands = (): Promise<void> => {
  return setSlashCommands(buildSlashCommands())
}
