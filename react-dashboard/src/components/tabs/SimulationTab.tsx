'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import ScenarioBuilder from '../sections/ScenarioBuilder'
import SimulationResults from '../sections/SimulationResults'
import InterventionPlayground from '../sections/InterventionPlayground'
import { containerVariants, itemVariants } from '@/lib/animation-utils'

interface Scenario {
  name: string
  treesPlanted: number
  coolRoofsArea: number
  waterBodiesCreated: number
  expectedCooling: number
}

const defaultScenario: Scenario = {
  name: 'Base Case',
  treesPlanted: 45000,
  coolRoofsArea: 82000,
  waterBodiesCreated: 15,
  expectedCooling: 2.9,
}

export default function SimulationTab() {
  const [scenario, setScenario] = useState<Scenario>(defaultScenario)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunSimulation = async () => {
    setIsRunning(true)
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRunning(false)
  }

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
          Climate Intervention Simulator
        </h1>
        <p className="text-muted-foreground">
          Design custom scenarios and see the projected impact on urban heat
        </p>
      </motion.div>

      {/* Main Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Builder */}
        <motion.div variants={itemVariants}>
          <ScenarioBuilder
            scenario={scenario}
            onScenarioChange={setScenario}
            onRunSimulation={handleRunSimulation}
            isRunning={isRunning}
          />
        </motion.div>

        {/* Simulation Results */}
        <motion.div variants={itemVariants}>
          <SimulationResults scenario={scenario} isRunning={isRunning} />
        </motion.div>
      </div>

      {/* Intervention Playground */}
      <motion.div variants={itemVariants}>
        <InterventionPlayground />
      </motion.div>

      {/* Comparison Section */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-xl border border-border/50 bg-card space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">Scenario Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Current Strategy',
              cooling: '2.9°C',
              cost: '₹18 Cr',
              impact: 'High',
              color: 'from-cyan-500 to-blue-500',
            },
            {
              title: 'Aggressive Intervention',
              cooling: '4.1°C',
              cost: '₹45 Cr',
              impact: 'Very High',
              color: 'from-green-500 to-emerald-500',
            },
            {
              title: 'Minimal Intervention',
              cooling: '1.2°C',
              cost: '₹8 Cr',
              impact: 'Moderate',
              color: 'from-yellow-500 to-orange-500',
            },
          ].map((scenario, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-4 rounded-lg bg-card border border-border/50"
            >
              <p className="font-semibold text-foreground">{scenario.title}</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cooling Impact:</span>
                  <span className="font-bold text-accent">{scenario.cooling}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investment:</span>
                  <span className="font-bold text-primary">{scenario.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impact Level:</span>
                  <span className={`font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                    {scenario.impact}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
