import type { ReactNode } from 'react'
import {
  PowerPlantPerceptronWidget,
  SigmoidActivationWidget,
} from './InteractiveLearningWidgets'
import { ParisRainMlpWidget } from './ParisRainMlpWidget'

export const blogWidgetRegistry: Record<string, ReactNode> = {
  'power-plant-perceptron': <PowerPlantPerceptronWidget />,
  'sigmoid-activation-playground': <SigmoidActivationWidget />,
  'paris-rain-mlp': <ParisRainMlpWidget />,
}
