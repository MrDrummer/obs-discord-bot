import { setScene } from "../obs"
import { findSceneNameForScenes } from "./config"

export const setSceneByArgument = async (name: string): Promise<void> => {
  const scene = findSceneNameForScenes(name)
  if (!scene) throw new Error("Scene not found")
  await setScene(scene.scene)
}
