'use client'

import { motion } from 'framer-motion'
import { Zap, Leaf, RotateCw } from 'lucide-react'

interface Scenario {
  name: string
  treesPlanted: number
  coolRoofsArea: number
  waterBodiesCreated: number
  expectedCooling: number
}

interface ScenarioBuilderProps {
  scenario: Scenario
  onScenarioChange: (scenario: Scenario) => void
  onRunSimulation: () => Promise<void>
  isRunning: boolean
}

export default function ScenarioBuilder({
  scenario,
  onScenarioChange,
  onRunSimulation,
  isRunning,
}: ScenarioBuilderProps) {
  const calculateCooling = (
    trees: number,
    roofs: number,
    water: number
  ) => {
    // Simplified calculation: each 10K trees = 0.5°C, each 20K sqm roofs = 0.3°C, each water body = 0.1°C
    return (
      (trees / 10000) * 0.5 +
      (roofs / 20000) * 0.3 +
      water * 0.1
    ).toFixed(2)
  }

  const handleChange = (field: keyof Scenario, value: number) => {
    const updated = { ...scenario, [field]: value }
    if (field !== 'expectedCooling') {
      updated.expectedCooling = parseFloat(
        calculateCooling(
          field === 'treesPlanted' ? value : updated.treesPlanted,
          field === 'coolRoofsArea' ? value : updated.coolRoofsArea,
          field === 'waterBodiesCreated' ? value : updated.waterBodiesCreated
        )
      )
    }
    onScenarioChange(updated)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Build Your Scenario
      </h2>

      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
        {/* Trees Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Leaf className="w-4 h-4 text-accent" />
              Trees to Plant
            </label>
            <span className="text-lg font-bold text-accent">
              {(scenario.treesPlanted / 1000).toFixed(0)}K
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={scenario.treesPlanted}
            onChange={(e) =>
              handleChange('treesPlanted', parseInt(e.target.value))
            }
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0</span>
            <span>200K</span>
          </div>
        </motion.div>

        {/* Cool Roofs Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap className="w-4 h-4 text-primary" />
              Cool Roofs Area (sq.m)
            </label>
            <span className="text-lg font-bold text-primary">
              {(scenario.coolRoofsArea / 1000).toFixed(0)}K
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={scenario.coolRoofsArea}
            onChange={(e) =>
              handleChange('coolRoofsArea', parseInt(e.target.value))
            }
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0</span>
            <span>200K</span>
          </div>
        </motion.div>

        {/* Water Bodies Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <RotateCw className="w-4 h-4 text-cyan-400" />
              Water Bodies Created
            </label>
            <span className="text-lg font-bold text-cyan-400">
              {scenario.waterBodiesCreated}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={scenario.waterBodiesCreated}
            onChange={(e) =>
              handleChange('waterBodiesCreated', parseInt(e.target.value))
            }
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0</span>
            <span>50</span>
          </div>
        </motion.div>

        {/* Expected Cooling Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30"
        >
          <p className="text-xs text-muted-foreground mb-1">
            Expected Cooling Impact
          </p>
          <p className="text-3xl font-bold text-accent">
            {scenario.expectedCooling}°C
          </p>
        </motion.div>

        {/* Run Button */}
        <motion.button
          onClick={onRunSimulation}
          disabled={isRunning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4"
              >
                ⚙️
              </motion.div>
              Running Simulation...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </motion.button>

        {/* Quick Presets */}
        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground mb-3">Quick Scenarios</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: 'Conservative',
                trees: 30000,
                roofs: 50000,
                water: 10,
              },
              {
                label: 'Balanced',
                trees: 45000,
                roofs: 82000,
                water: 15,
              },
              {
                label: 'Aggressive',
                trees: 80000,
                roofs: 150000,
                water: 30,
              },
            ].map((preset) => (
              <motion.button
                key={preset.label}
                onClick={() => {
                  onScenarioChange({
                    ...scenario,
                    treesPlanted: preset.trees,
                    coolRoofsArea: preset.roofs,
                    waterBodiesCreated: preset.water,
                    expectedCooling: parseFloat(
                      calculateCooling(preset.trees, preset.roofs, preset.water)
                    ),
                  })
                }}
                whileHover={{ y: -2 }}
                className="px-2 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                {preset.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
