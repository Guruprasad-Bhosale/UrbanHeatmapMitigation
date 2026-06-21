'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Leaf, Home, Droplet } from 'lucide-react'
import { itemVariants } from '@/lib/animation-utils'

export default function InterventionPlayground() {
  const [treesPlanted, setTreesPlanted] = useState(45000)
  const [coolRoofsArea, setCoolRoofsArea] = useState(82000)
  const [waterBodiesCreated, setWaterBodiesCreated] = useState(15)
  const interventions = [
    {
      name: 'Urban Greening',
      icon: Leaf,
      color: 'from-green-500 to-emerald-500',
      value: treesPlanted,
      onChange: setTreesPlanted,
      min: 0,
      max: 100000,
      step: 5000,
      unit: 'trees',
      description: 'Plant trees across priority zones',
    },
    {
      name: 'Cool Roofs',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      value: coolRoofsArea,
      onChange: setCoolRoofsArea,
      min: 0,
      max: 5000000,
      step: 100000,
      unit: 'm²',
      description: 'Apply reflective coatings',
    },
    {
      name: 'Water Bodies',
      icon: Droplet,
      color: 'from-cyan-500 to-blue-500',
      value: waterBodiesCreated,
      onChange: setWaterBodiesCreated,
      min: 0,
      max: 500,
      step: 10,
      unit: 'ponds',
      description: 'Create retention ponds',
    },
  ]

  return (
    <motion.div
      variants={itemVariants}
      className="space-y-6 p-6 rounded-lg bg-card border border-border/50"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Intervention Playground
        </h3>
        <p className="text-sm text-muted-foreground">
          Adjust intervention levels to see real-time impact projections
        </p>
      </div>

      <div className="space-y-6">
        {interventions.map((intervention, idx) => {
          const Icon = intervention.icon
          const percentage = (intervention.value / intervention.max) * 100

          return (
            <motion.div
              key={intervention.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`p-2 rounded-lg bg-gradient-to-br ${intervention.color}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {intervention.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {intervention.description}
                    </p>
                  </div>
                </div>
                <motion.div
                  className="text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 + 0.1 }}
                >
                  <p className="text-lg font-bold text-foreground">
                    {intervention.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {intervention.unit}
                  </p>
                </motion.div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={intervention.min}
                  max={intervention.max}
                  step={intervention.step}
                  value={intervention.value}
                  onChange={(e) => intervention.onChange(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, rgba(0, 217, 255, 0.2) 0%, rgba(0, 217, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.05) ${percentage}%, rgba(255, 255, 255, 0.05) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {intervention.min.toLocaleString()}</span>
                  <span>{Math.round(percentage)}%</span>
                  <span>Max: {intervention.max.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 rounded-lg bg-primary/10 border border-primary/20"
      >
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Pro Tip:
          </span>{' '}
          Combining multiple interventions amplifies the cooling effect. Urban Greening
          works best with Cool Roofs and Water Bodies for maximum synergy.
        </p>
      </motion.div>
    </motion.div>
  )
}
