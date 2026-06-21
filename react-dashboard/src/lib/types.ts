export type TabType = 'overview' | 'analysis' | 'simulation' | 'recommendations'

export interface CityZone {
  id: string
  name: string
  riskScore: number // 0-100
  riskLevel: 'Safe' | 'Moderate' | 'Severe' | 'Extreme'
  currentTemp: number
  coolingPotential: number
  population: number
  vegetationDeficit: number
  buildingDensity: number
  lowAlbedo: number
  roadConcentration: number
  other: number
}

export interface Intervention {
  id: string
  name: string
  cost: number // in crores
  expectedCooling: number // in degrees
  confidence: number // 0-100%
  population: number
  roiStars: number // 1-5
}

export interface DashboardMetrics {
  averageTemp: number
  peakTemp: number
  populationAtRisk: number
  heatStressIndex: number
  coolingPotential: number
  predictedReduction: number
  aiConfidence: number
  pixelsProcessed: number
  overallRiskScore: number
}

export interface VisualizationData {
  before: number[][]
  after: number[][]
  cityName: string
}
