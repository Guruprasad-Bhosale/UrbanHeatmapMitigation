'use client'

import { motion } from 'framer-motion'
import AIWorkflowHero from '../sections/AIWorkflowHero'
import ImpactSummaryCard from '../sections/ImpactSummaryCard'
import CityWideImpactViz from '../sections/CityWideImpactViz'
import BeforeAfterSlider from '../sections/BeforeAfterSlider'
import AIOptimizationPlayback from '../sections/AIOptimizationPlayback'
import ProjectionComparison from '../sections/ProjectionComparison'
import KPICards from '../sections/KPICards'

export default function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 px-6 py-8 mx-auto max-w-7xl"
    >
      <AIWorkflowHero />
      <div id="impact-card">
        <ImpactSummaryCard />
      </div>
      <div id="city-viz">
        <CityWideImpactViz />
      </div>
      <div id="slider-section">
        <BeforeAfterSlider />
      </div>
      <div id="playback-section">
        <AIOptimizationPlayback />
      </div>
      <div id="kpi-cards">
        <KPICards />
      </div>
      <div id="projection-section">
        <ProjectionComparison />
      </div>
    </motion.div>
  )
}
