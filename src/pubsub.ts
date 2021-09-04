import { PubSub } from "@google-cloud/pubsub"
import { subscriber, secrets } from "./config"

export let pubSubClient: PubSub

export default (): PubSub => {
  const psc = new PubSub({
    credentials: subscriber,
    projectId: subscriber.project_id
  })

  pubSubClient = psc

  psc.subscription(secrets.pubsub.subscriber).on("message", pubSubData => {
    pubSubData.ack()
    const data = Buffer.from(pubSubData.data, "base64").toString()
    console.log("data :", data)
  })

  return psc
}
