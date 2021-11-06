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

  const audioCommand = new SlashCommandBuilder()
    .setName("audio")
    .setDescription("Gets or sets an audio source.")
  audioCommand.addSubcommand(audio => {
    const list = audio.setName("list")
      .setDescription("Lists valid audio channel names for the current or specified scene")
    // list.addStringOption(option => {
    //   const scenesSubcommand = option.setName("scene")
    //     .setDescription("The scene to list audio sources from.");
    //   [...config.sources, ...config.layouts].forEach(c => {
    //     // console.log("sc :", c.arg)
    //     scenesSubcommand.addChoice(c.arg, c.arg)
    //   })
    //   return scenesSubcommand
    // })
    return list
  });

  ["set", "add", "sub"].forEach(subCmd => {
    audioCommand.addSubcommand(audio => {
      const cmd = audio.setName(subCmd)
        .setDescription("Set the audo channel to a %. Maps to -100dB to 0dB. 60% (40dB) is typical.")
      cmd.addStringOption(set => {
        return set.setName("source")
          .setDescription("The audio source to change the dB value for.")
          .setRequired(true)
      })
      cmd.addIntegerOption(set => {
        return set.setName("value")
          .setDescription("The audio % value")
          .setRequired(true)
      })
      return cmd
    })

  })


  const muteCommand = new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mutes an audio source.")
  muteCommand.addStringOption(mute => {
    return mute.setName("source")
      .setDescription("The audio source to mute")
      .setRequired(true)
  })

  const unmuteCommand = new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmutes and audio source.")
  unmuteCommand.addStringOption(unmute => {
    return unmute.setName("source")
      .setDescription("The audio source to unmute")
      .setRequired(true)
  })

  const dieCommand = new SlashCommandBuilder()
    .setName("die")
    .setDescription("Cuts to the hold screen")

  return [
    sceneBuilder,
    slotBuilder,
    audioCommand,
    dieCommand,
    streamBuilder,
    muteCommand,
    unmuteCommand
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
