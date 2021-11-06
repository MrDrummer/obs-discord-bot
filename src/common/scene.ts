import { setScene } from "../obs/socket"
import { getSceneConfigByArgument } from "./config"

export const setSceneByArgument = async (name: string): Promise<void> => {
  const scene = getSceneConfigByArgument(name)
  if (!scene) throw new Error(`Scene not found: ${ name } ${ scene }`)
  await setScene(scene.scene)
}
