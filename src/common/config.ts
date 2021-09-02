import { config, SceneMappingLayouts, SceneMappingSource } from "../config"
import { getCurrentScene } from "../obs"

export const getAllScenes = (): (SceneMappingLayouts | SceneMappingSource)[] => {
  return [...config.sources, ...config.layouts]
}

export const getSourceScenes = (): SceneMappingSource[] => {
  return config.sources
}

export const getSourceConfigByArgument = (argument: string): SceneMappingSource | undefined => {
  return getSourceScenes().find(s => s.arg === argument)
}

export const getSceneConfigByArgument = (argument: string): SceneMappingLayouts | SceneMappingSource | undefined => {
  return getAllScenes().find(s => s.arg === argument)
}

export const getTypeOfSceneFromScene = (scene: SceneMappingLayouts | SceneMappingSource): "source" | "layout" | undefined => {
  const inSource = config.sources.find(s => s.arg === scene.arg)
  const inLayout = config.layouts.find(l => l.arg === scene.arg)

  return inSource
    ? "source"
    : inLayout
      ? "layout"
      : undefined
}

export const getTypeOfSceneFromArg = (arg: string): "source" | "layout" | undefined => {
  const inSource = config.sources.find(s => s.arg === arg)
  const inLayout = config.layouts.find(l => l.arg === arg)

  return inSource
    ? "source"
    : inLayout
      ? "layout"
      : undefined
}

export const getConfigForCurrentScene = async (): Promise<SceneMappingLayouts | SceneMappingSource | undefined> => {
  const currentScene = await getCurrentScene()
  return getAllScenes().find(s => s.scene === currentScene.name)
}

export const slots = config.slots
