import { setSceneSourceVisibility } from "../obs/socket"
import { getSourceConfigByArgument, getSourceScenes, slots } from "./config"

export const setSlotSource = async (slotArgument: string, sourceArgument: string): Promise<void> => {
  const sourceConfig = getSourceConfigByArgument(sourceArgument)
  if (!sourceConfig) return
  const allOtherSources = getSourceScenes().filter(s => s.arg !== sourceArgument)
  const slotScene = slots[slotArgument]

  await Promise.all([
    setSceneSourceVisibility(slotScene, sourceConfig.source, true),
    allOtherSources.filter(s => !s.hideSlot).map(s => setSceneSourceVisibility(slotScene, s.source, false))
  ])
}
