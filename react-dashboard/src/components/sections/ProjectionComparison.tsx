'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { projectionData } from '@/lib/mockData'

export default function ProjectionComparison() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        2030 Impact Projection
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* If No Action Is Taken */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl border border-red-700/50 bg-gradient-to-br from-red-900/10 to-red-900/5 p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl -mr-16 -mt-16" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-semibold text-foreground">
                If No Action Is Taken
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Projected consequences by 2030 without intervention
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-900/20 border border-red-700/30">
                <div className="text-2xl font-bold text-destructive">
                  +2.1°C
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Temperature Increase
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average surface temperature rise
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-900/20 border border-red-700/30">
                <div className="text-2xl font-bold text-destructive">+37%</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Population At Risk
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Additional vulnerable people
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-900/20 border border-red-700/30">
                <div className="text-2xl font-bold text-destructive">+11</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    High Risk Zones
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    New critical heat areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* With UrbanHeatAI Strategy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative overflow-hidden rounded-xl border border-green-700/50 bg-gradient-to-br from-green-900/10 to-green-900/5 p-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">
                With UrbanHeatAI Strategy
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Expected outcomes with our interventions
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-900/20 border border-green-700/30">
                <div className="text-2xl font-bold text-accent">-2.9°C</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Urban Heat Reduction
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sustainable temperature decrease
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-900/20 border border-green-700/30">
                <div className="text-2xl font-bold text-accent">84,000</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    People Protected
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Safe from heat stress
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-900/20 border border-green-700/30">
                <div className="text-2xl font-bold text-accent">14</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Priority Zones Addressed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strategic intervention areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
