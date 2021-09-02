import { config, SceneMapping } from "../config"

export const getAllScenes = (): SceneMapping[] => {
  return [...config.sources, ...config.layouts]
}

export const getSourceScenes = (): SceneMapping[] => {
  return config.sources
}

export const findSceneNameForSourcesAndLayouts = (scenes: SceneMapping[], argument: string): SceneMapping | undefined => {
  return scenes.find(s => s.arg === argument)
}

export const findSceneNameForSource = (argument: string): SceneMapping | undefined => {
  return findSceneNameForSourcesAndLayouts(getSourceScenes(), argument)
}

export const findSceneNameForScenes = (argument: string): SceneMapping | undefined => {
  return findSceneNameForSourcesAndLayouts(getAllScenes(), argument)
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
