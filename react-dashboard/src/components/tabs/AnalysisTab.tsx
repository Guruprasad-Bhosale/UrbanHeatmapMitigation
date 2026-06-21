'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import GeospatialHeatmap from '../sections/GeospatialHeatmap'
import RiskAssessmentMatrix from '../sections/RiskAssessmentMatrix'
import UrbanDensityAnalysis from '../sections/UrbanDensityAnalysis'
import VegetationDeficitMap from '../sections/VegetationDeficitMap'
import { containerVariants, itemVariants } from '@/lib/animation-utils'

export default function AnalysisTab() {
  const [selectedZone, setSelectedZone] = useState<string>('')

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="space-y-8 px-6 py-8 mx-auto max-w-7xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Geospatial Analysis & Risk Assessment
        </h1>
        <p className="text-muted-foreground">
          Deep dive into urban heat patterns, risk factors, and contributing elements
        </p>
      </motion.div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geospatial Heatmap */}
        <motion.div variants={itemVariants}>
          <GeospatialHeatmap 
            onZoneSelect={setSelectedZone}
            selectedZone={selectedZone}
          />
        </motion.div>

        {/* Risk Assessment Matrix */}
        <motion.div variants={itemVariants}>
          <RiskAssessmentMatrix selectedZone={selectedZone} />
        </motion.div>
      </div>

      {/* Secondary Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urban Density Analysis */}
        <motion.div variants={itemVariants}>
          <UrbanDensityAnalysis />
        </motion.div>

        {/* Vegetation Deficit Map */}
        <motion.div variants={itemVariants}>
          <VegetationDeficitMap />
        </motion.div>
      </div>

      {/* Risk Factor Breakdown */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Risk Factor Contribution Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Building Density', value: '42%', color: 'from-orange-500 to-red-500' },
            { label: 'Low Albedo', value: '28%', color: 'from-red-500 to-pink-500' },
            { label: 'Vegetation Deficit', value: '18%', color: 'from-yellow-500 to-orange-500' },
            { label: 'Road Concentration', value: '12%', color: 'from-amber-500 to-orange-500' },
          ].map((factor, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-4 rounded-lg border border-border/50 bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{factor.label}</p>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${factor.color}`} />
              </div>
              <p className="text-2xl font-bold text-primary">{factor.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contribution to heat risk
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
