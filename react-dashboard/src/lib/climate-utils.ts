// Color interpolation for heat visualization
export function tempToColor(temp: number, minTemp = 30, maxTemp = 45): string {
  const ratio = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)))

  // Blue (cool) -> Green -> Yellow -> Orange -> Red (hot)
  if (ratio < 0.25) {
    // Blue to Green
    const t = ratio / 0.25
    const r = Math.round(0 * (1 - t) + 0 * t)
    const g = Math.round(180 * (1 - t) + 255 * t)
    const b = Math.round(255 * (1 - t) + 0 * t)
    return `rgb(${r}, ${g}, ${b})`
  } else if (ratio < 0.5) {
    // Green to Yellow
    const t = (ratio - 0.25) / 0.25
    const r = Math.round(0 * (1 - t) + 255 * t)
    const g = Math.round(255 * (1 - t) + 255 * t)
    const b = 0
    return `rgb(${r}, ${g}, ${b})`
  } else if (ratio < 0.75) {
    // Yellow to Orange
    const t = (ratio - 0.5) / 0.25
    const r = 255
    const g = Math.round(255 * (1 - t) + 127 * t)
    const b = 0
    return `rgb(${r}, ${g}, ${b})`
  } else {
    // Orange to Red
    const t = (ratio - 0.75) / 0.25
    const r = 255
    const g = Math.round(127 * (1 - t) + 0 * t)
    const b = 0
    return `rgb(${r}, ${g}, ${b})`
  }
}

// Risk level badge color
export function getRiskLevelColor(
  riskLevel: 'Safe' | 'Moderate' | 'Severe' | 'Extreme'
): string {
  switch (riskLevel) {
    case 'Safe':
      return 'bg-green-900/30 text-green-300 border-green-700'
    case 'Moderate':
      return 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
    case 'Severe':
      return 'bg-orange-900/30 text-orange-300 border-orange-700'
    case 'Extreme':
      return 'bg-red-900/30 text-red-300 border-red-700'
  }
}

// Format number helpers
export function formatTemp(temp: number): string {
  return `${temp.toFixed(1)}°C`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function formatCurrency(crores: number): string {
  return `₹${crores} Cr`
}

// Gauge color based on percentage
export function getGaugeColor(percentage: number): string {
  if (percentage >= 80) return '#00FF88' // Green
  if (percentage >= 60) return '#FFC400' // Yellow
  if (percentage >= 40) return '#FF6F00' // Orange
  return '#FF1744' // Red
}
