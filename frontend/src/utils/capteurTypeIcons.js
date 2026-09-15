import { IconTemperature, IconDroplet, IconGauge } from '@tabler/icons-react'

export const getIconForType = (type) => {
  const normalized = type.toLowerCase()
  if (normalized.includes('temp')) return IconTemperature
  if (normalized.includes('humid')) return IconDroplet
  return IconGauge
}