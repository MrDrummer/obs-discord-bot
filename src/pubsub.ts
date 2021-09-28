import { PubSub, Message } from "@google-cloud/pubsub"
import { remote } from "./common"
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

const handlePubSub = async (pubSubData: Message): Promise<void> => {
  const data = JSON.parse(pubSubData.data.toString()) as remote.RemoteData
  await remote.parseAndExecuteRemoteCommand(data)
  console.log("PubSub :", data.rawCommand)
  pubSubData.ack()
}
