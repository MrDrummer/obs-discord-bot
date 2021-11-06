import { CommandInteraction } from "discord.js"
import { yargs, reply } from "../common"
import { getAudioSources } from "../common/config"
import { getVolume, setVolume } from "../obs/socket"
// import { config } from "../config"
// import { setScene } from "../obs"

export default async (yargs: yargs.CommandArgs, interaction?: CommandInteraction): Promise<void> => {
  try {
    const command = yargs.args._[0]
    const args = yargs.args

    if (command === "list") {

      const audioSources = getAudioSources()
      const audioSourceValues = (await Promise.all(audioSources.map(audioSource => {
        return getVolume(audioSource, true)
      }))).map(v => `${ v.name }: ${ decibelToPercent(v.volume) } (${ v.muted ? "muted" : "unmuted" })`)

      reply(yargs, "**audio list:**\n>>> " + audioSourceValues.join("\n"), interaction)
    } else if (command === "set") {
      console.log("args :", yargs)

      const volume = percentToDecibel(args.value)
      await setVolume(args.source, volume, true)

      reply(yargs, `**audio set:**\n${ args.source }: ${ volume }dB`, interaction)
    } else if (command === "add" || command === "sub") {
      const currentVolume = await getVolume(args.source, true)
      const percent = decibelToPercent(currentVolume.volume)
      const difference = args.value * (command === "add" ? 1 : -1)

      const newValue = percent + difference
      await setVolume(args.source, percentToDecibel(newValue), true)
      reply(yargs, `**audio ${ command }:**\n${ args.source }: ${ percent }% -> ${ newValue }%`, interaction)
    } else {
      reply(yargs, "audio acknowledged", interaction)
    }

  } catch (e) {
    console.error("Error :", e)
    reply(yargs, "There was an error setting the scene.", interaction)
  }
  return
}

const percentToDecibel = (decibels: number): number => {
  return decibels - 100
}

const decibelToPercent = (percent: number): number => {
  return percent + 100
}
