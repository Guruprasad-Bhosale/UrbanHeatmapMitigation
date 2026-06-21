import { CityZone, Intervention, DashboardMetrics } from './types'

export const cityZones: CityZone[] = [
  {
    id: 'shivajinagar',
    name: 'Shivajinagar',
    riskScore: 92,
    riskLevel: 'Extreme',
    currentTemp: 41.2,
    coolingPotential: 3.4,
    population: 95000,
    vegetationDeficit: 38,
    buildingDensity: 24,
    lowAlbedo: 18,
    roadConcentration: 12,
    other: 8,
  },
  {
    id: 'pimpri',
    name: 'Pimpri',
    riskScore: 88,
    riskLevel: 'Extreme',
    currentTemp: 40.8,
    coolingPotential: 2.9,
    population: 87000,
    vegetationDeficit: 35,
    buildingDensity: 26,
    lowAlbedo: 19,
    roadConcentration: 13,
    other: 7,
  },
  {
    id: 'hinjewadi',
    name: 'Hinjewadi',
    riskScore: 84,
    riskLevel: 'Severe',
    currentTemp: 40.5,
    coolingPotential: 2.7,
    population: 72000,
    vegetationDeficit: 32,
    buildingDensity: 28,
    lowAlbedo: 20,
    roadConcentration: 14,
    other: 6,
  },
  {
    id: 'baner',
    name: 'Baner',
    riskScore: 81,
    riskLevel: 'Severe',
    currentTemp: 40.2,
    coolingPotential: 2.5,
    population: 68000,
    vegetationDeficit: 30,
    buildingDensity: 25,
    lowAlbedo: 21,
    roadConcentration: 15,
    other: 9,
  },
  {
    id: 'katraj',
    name: 'Katraj',
    riskScore: 78,
    riskLevel: 'Severe',
    currentTemp: 39.8,
    coolingPotential: 2.3,
    population: 54000,
    vegetationDeficit: 28,
    buildingDensity: 22,
    lowAlbedo: 19,
    roadConcentration: 16,
    other: 15,
  },
]

export const interventions: Intervention[] = [
  {
    id: 'urban-greening',
    name: 'Urban Greening',
    cost: 15,
    expectedCooling: 2.8,
    confidence: 91,
    population: 85000,
    roiStars: 5,
  },
  {
    id: 'cool-roofs',
    name: 'Cool Roofs',
    cost: 8,
    expectedCooling: 1.2,
    confidence: 87,
    population: 42000,
    roiStars: 4,
  },
  {
    id: 'reflective-surfaces',
    name: 'Reflective Surfaces',
    cost: 4,
    expectedCooling: 0.5,
    confidence: 78,
    population: 20000,
    roiStars: 3,
  },
  {
    id: 'water-bodies',
    name: 'Water Bodies',
    cost: 12,
    expectedCooling: 1.8,
    confidence: 94,
    population: 95000,
    roiStars: 5,
  },
]

export const dashboardMetrics: DashboardMetrics = {
  averageTemp: 40.2,
  peakTemp: 41.2,
  populationAtRisk: 320000,
  heatStressIndex: 7.8,
  coolingPotential: 12.4,
  predictedReduction: 2.9,
  aiConfidence: 94,
  pixelsProcessed: 500000000,
  overallRiskScore: 86,
}

export const kpiTrendData = [
  { date: 'Jan', temp: 38.5, riskScore: 72 },
  { date: 'Feb', temp: 39.2, riskScore: 75 },
  { date: 'Mar', temp: 39.8, riskScore: 78 },
  { date: 'Apr', temp: 40.5, riskScore: 82 },
  { date: 'May', temp: 41.2, riskScore: 86 },
]

export const explanabilityData = [
  { name: 'Vegetation Deficit', value: 38, color: '#00FF88' },
  { name: 'Building Density', value: 24, color: '#00D9FF' },
  { name: 'Low Albedo', value: 18, color: '#7C3AED' },
  { name: 'Road Concentration', value: 12, color: '#FF6F00' },
  { name: 'Other Factors', value: 8, color: '#FF1744' },
]

// Generate simple 20x25 heat grid for visualization
export const generateHeatGrid = (baseTemp: number) => {
  const grid: number[][] = []
  for (let i = 0; i < 20; i++) {
    const row: number[] = []
    for (let j = 0; j < 25; j++) {
      // Create a heatmap pattern with higher temps in center
      const distFromCenter = Math.sqrt(
        Math.pow(i - 10, 2) + Math.pow(j - 12, 2)
      )
      const temp = baseTemp - distFromCenter * 0.15 + Math.random() * 2
      row.push(Math.max(temp, 30))
    }
    grid.push(row)
  }
  return grid
}

export const mockBeforeGrid = generateHeatGrid(41.2)
export const mockAfterGrid = generateHeatGrid(38.1)

// 2030 Projection data
export const projectionData = {
  inaction: {
    tempIncrease: 2.1,
    populationAtRiskIncrease: 37,
    highRiskZonesIncrease: 11,
  },
  withStrategy: {
    tempReduction: 2.9,
    peopleSaved: 84000,
    priorityZonesAddressed: 14,
  },
}
