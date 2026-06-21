'use client'

import { motion } from 'framer-motion'
import { cityZones } from '@/lib/mockData'
import { AlertTriangle, TrendingUp, Users, Zap } from 'lucide-react'

interface RiskAssessmentMatrixProps {
  selectedZone: string
}

export default function RiskAssessmentMatrix({
  selectedZone,
}: RiskAssessmentMatrixProps) {
  const allZones = selectedZone !== ''
    ? cityZones.filter((z) => z.id === selectedZone)
    : cityZones

  const avgRiskScore =
    allZones.reduce((sum, z) => sum + z.riskScore, 0) / allZones.length
  const totalPopulation = allZones.reduce((sum, z) => sum + z.population, 0)
  const totalCoolingPotential =
    allZones.reduce((sum, z) => sum + z.coolingPotential, 0) / allZones.length

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'from-red-500 to-red-600'
    if (score >= 60) return 'from-orange-500 to-red-500'
    if (score >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-emerald-500'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        {selectedZone ? 'Zone Risk Profile' : 'Risk Assessment Matrix'}
      </h2>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 gap-3">
        {/* Average Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          className={`p-4 rounded-lg border border-border/50 bg-gradient-to-br ${getRiskColor(
            avgRiskScore
          )} opacity-10`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Average Risk Score</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {avgRiskScore.toFixed(0)}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-destructive opacity-70" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {avgRiskScore >= 80
              ? 'Extreme - Immediate intervention needed'
              : avgRiskScore >= 60
                ? 'Severe - Priority intervention required'
                : avgRiskScore >= 40
                  ? 'Moderate - Regular monitoring'
                  : 'Safe - Maintain current standards'}
          </p>
        </motion.div>

        {/* Population Impact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-lg border border-border/50 bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Population at Risk</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {(totalPopulation / 1000).toFixed(0)}K
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500 opacity-70" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Vulnerable population requiring protection
          </p>
        </motion.div>

        {/* Cooling Potential */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-lg border border-border/50 bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg Cooling Potential</p>
              <p className="text-3xl font-bold text-accent mt-1">
                {totalCoolingPotential.toFixed(1)}°C
              </p>
            </div>
            <Zap className="w-8 h-8 text-accent opacity-70" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Maximum achievable temperature reduction
          </p>
        </motion.div>
      </div>

      {/* Risk Factor Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-lg border border-border/50 bg-card"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Primary Risk Factors
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Building Density', value: 42 },
            { name: 'Low Albedo Surfaces', value: 28 },
            { name: 'Vegetation Deficit', value: 18 },
            { name: 'Road Concentration', value: 12 },
          ].map((factor, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-foreground">{factor.name}</p>
                <p className="text-xs font-bold text-primary">{factor.value}%</p>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ delay: 0.1 + idx * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trend Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-lg bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-700/30"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Risk Trend: Increasing
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              +3.2°C projected increase over 5 years without intervention
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
