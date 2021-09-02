import { Client, Intents, Channel, TextChannel } from "discord.js"
import { REST } from "@discordjs/rest"
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9"
import { secrets, config } from "./config"
import { SlashCommandBuilder } from "@discordjs/builders"
let botClient: Client

interface BuiltCommand {
  name: string
  description: string
  options: APIApplicationCommandOption[]
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
  const sceneBuilder = new SlashCommandBuilder()
    .setName("sc")
    .setDescription("Set the active scene.");
  [...config.sources, ...config.layouts].forEach(c => {
    if (disabledCameras && disabledCameras.includes(c.scene)) return
    sceneBuilder.addSubcommand(sc => {
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
        if (disabledCameras && disabledCameras.includes(c.scene)) return
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
          subcommand.addChoice(s.arg, s.arg)
        })
        return subcommand
      })
  })
  const pingCommand = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns ping time")
  return [sceneBuilder, slotBuilder, pingCommand].map(c => c.toJSON())
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
