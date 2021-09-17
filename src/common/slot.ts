import { obsSocket } from "../obs"
import { getSourceConfigByArgument, getSourceScenes, slots } from "./config"

export const setSceneSourceVisibility = (scene: string, source: string, render: boolean): Promise<void> => {
  // console.log("scene, source, render :", scene, source, render)
  return obsSocket.send("SetSceneItemRender", {
    "scene-name": scene,
    source,
    render
  })
}

export const setSlotSource = async (slotArgument: string, sourceArgument: string): Promise<void> => {
  const sourceConfig = getSourceConfigByArgument(sourceArgument)
  if (!sourceConfig) return
  const allOtherSources = getSourceScenes().filter(s => s.arg !== sourceArgument)
  const slotScene = slots[slotArgument]

  // console.log("sourceConfig :", sourceConfig)
  // console.log("allOtherSources :", allOtherSources)
  await Promise.all([
    setSceneSourceVisibility(slotScene, sourceConfig.source, true),
    allOtherSources.filter(s => !s.hideSlot).map(s => setSceneSourceVisibility(slotScene, s.source, false))
  ])
}
