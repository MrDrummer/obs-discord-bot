import { PubSub, Message } from "@google-cloud/pubsub"
import yargs from "yargs-parser"
import { commands } from "./commands"
import { subscriber, secrets } from "./config"

export let pubSubClient: PubSub

export default (): PubSub => {
  const psc = new PubSub({
    credentials: subscriber,
    projectId: subscriber.project_id
  })

  pubSubClient = psc

  psc.subscription(secrets.pubsub.subscriber).on("message", handlePubSub)

  return psc
}

interface PubSubMessage {
  identity: string
  rawCommand: string
}

const handlePubSub = async (pubSubData: Message): Promise<void> => {
  pubSubData.ack()
  const data = JSON.parse(pubSubData.data.toString()) as PubSubMessage
  // console.log("data :", data)

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
