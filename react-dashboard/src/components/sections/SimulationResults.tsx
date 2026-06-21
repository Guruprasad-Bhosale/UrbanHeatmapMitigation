'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Users, Leaf, Droplets } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/animation-utils'

interface Scenario {
  name: string
  treesPlanted: number
  coolRoofsArea: number
  waterBodiesCreated: number
  expectedCooling: number
}

interface SimulationResultsProps {
  scenario: Scenario
  isRunning: boolean
}

export default function SimulationResults({
  scenario,
  isRunning,
}: SimulationResultsProps) {
  const cooling = scenario.expectedCooling
  const populationBenefited = 84000
  const greenArea = Math.round((scenario.treesPlanted / 100000) * 100)
  const waterBodies = scenario.waterBodiesCreated
  const results = [
    {
      label: 'Temperature Reduction',
      value: `${cooling.toFixed(1)}°C`,
      icon: TrendingDown,
      color: 'from-blue-500 to-cyan-500',
      description: 'Below baseline',
    },
    {
      label: 'People Protected',
      value: populationBenefited.toLocaleString(),
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      description: 'from heat stress',
    },
    {
      label: 'Green Area Created',
      value: `${greenArea}%`,
      icon: Leaf,
      color: 'from-lime-500 to-green-500',
      description: 'canopy coverage',
    },
    {
      label: 'Water Bodies',
      value: waterBodies,
      icon: Droplets,
      color: 'from-cyan-500 to-blue-500',
      description: 'new retention ponds',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Simulation Results
          </h3>
          <p className="text-sm text-muted-foreground">
            {isRunning ? 'Running simulation...' : 'Projected impact of your scenario'}
          </p>
        </div>
        {isRunning && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
          />
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((result, idx) => {
          const Icon = result.icon
          return (
            <motion.div
              key={result.label}
              variants={itemVariants}
              className={`p-4 rounded-lg bg-gradient-to-br ${result.color} bg-opacity-5 border border-${result.color.split('-')[1]}-500/20`}
            >
              <motion.div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${result.color} flex items-center justify-center mb-3`}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
              <p className="text-xs text-muted-foreground mb-1">{result.label}</p>
              <motion.p
                className="text-2xl font-bold text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {result.value}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-1">
                {result.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
