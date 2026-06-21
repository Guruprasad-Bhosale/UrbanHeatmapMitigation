'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Zap, Users, Target } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/animation-utils'

interface Intervention {
  name: string
  cost: string
  cooling: string
  population: string
  confidence: number
  roi: number
}

const interventions: Intervention[] = [
  {
    name: 'Urban Greening',
    cost: '₹15 Cr',
    cooling: '-2.8°C',
    population: '85,000',
    confidence: 91,
    roi: 5,
  },
  {
    name: 'Cool Roofs',
    cost: '₹8 Cr',
    cooling: '-1.2°C',
    population: '42,000',
    confidence: 87,
    roi: 4,
  },
  {
    name: 'Water Bodies',
    cost: '₹12 Cr',
    cooling: '-1.8°C',
    population: '95,000',
    confidence: 94,
    roi: 5,
  },
  {
    name: 'Reflective Surfaces',
    cost: '₹4 Cr',
    cooling: '-0.5°C',
    population: '20,000',
    confidence: 78,
    roi: 3,
  },
]

export default function CostImpactAnalysis() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Intervention Cost vs Impact Analysis
        </h3>
        <p className="text-sm text-muted-foreground">
          ROI breakdown with AI confidence levels
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 bg-background/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                Intervention
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Cost
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Cooling Impact
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Population
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                Confidence
              </th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">
                ROI
              </th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((intervention, idx) => (
              <motion.tr
                key={intervention.name}
                variants={itemVariants}
                className="border-b border-border/30 hover:bg-background/30 transition-colors"
              >
                <td className="px-4 py-4 font-medium text-foreground">
                  {intervention.name}
                </td>
                <td className="px-4 py-4 text-right text-foreground">
                  <span className="font-semibold">{intervention.cost}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <motion.span
                    className="inline-flex items-center gap-1 text-primary font-semibold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <TrendingDown className="w-4 h-4" />
                    {intervention.cooling}
                  </motion.span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="inline-flex items-center gap-1 text-accent">
                    <Users className="w-4 h-4" />
                    {intervention.population}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex-1 max-w-xs h-2 rounded-full bg-border/50 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${intervention.confidence}%` }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-12 text-right">
                      {intervention.confidence}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 + i * 0.05 }}
                        className={`w-3.5 h-3.5 rounded-full ${
                          i < intervention.roi
                            ? 'bg-accent'
                            : 'bg-border/50'
                        }`}
                      />
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Total Investment
              </p>
              <p className="text-2xl font-bold text-primary">₹39 Crore</p>
              <p className="text-xs text-muted-foreground mt-1">
                across all interventions
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20"
        >
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Expected Outcome
              </p>
              <p className="text-2xl font-bold text-accent">-5.8°C</p>
              <p className="text-xs text-muted-foreground mt-1">
                total temperature reduction
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
