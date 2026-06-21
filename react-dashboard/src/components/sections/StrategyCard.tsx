'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, TrendingDown, Users, Clock, Zap } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/animation-utils'

export default function StrategyCard() {
  const strategy = {
    title: 'Optimal Urban Heat Mitigation Strategy',
    overview: 'AI-optimized intervention plan targeting Pune Metropolitan Region',
    interventions: [
      {
        name: 'Urban Greening',
        cooling: '-2.8°C',
        population: '85,000',
        confidence: 91,
        description: 'Strategic tree planting in priority zones',
      },
      {
        name: 'Water Bodies',
        cooling: '-1.8°C',
        population: '95,000',
        confidence: 94,
        description: 'Establish retention ponds and water features',
      },
      {
        name: 'Cool Roofs',
        cooling: '-1.2°C',
        population: '42,000',
        confidence: 87,
        description: 'Reflective coatings for commercial buildings',
      },
    ],
    summary: {
      totalCooling: '-5.8°C',
      peopleProtected: '222,000',
      investment: '₹35 Crore',
      timeline: '18 months',
      overallConfidence: 92,
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{strategy.title}</h2>
        <p className="text-sm text-muted-foreground">{strategy.overview}</p>
      </div>

      {/* Main Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategy.interventions.map((intervention, idx) => (
          <motion.div
            key={intervention.name}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="p-4 rounded-lg bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  {intervention.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {intervention.description}
                </p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Cooling</span>
                <span className="text-sm font-bold text-primary">
                  {intervention.cooling}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">People</span>
                <span className="text-sm font-bold text-accent">
                  {intervention.population}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 rounded-full bg-border/50 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${intervention.confidence}%` }}
                      transition={{ delay: idx * 0.1 + 0.2, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-8">
                    {intervention.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Strategy Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Cooling</p>
            <motion.p
              className="text-xl font-bold text-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {strategy.summary.totalCooling}
            </motion.p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">People Protected</p>
            <motion.p
              className="text-xl font-bold text-accent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {strategy.summary.peopleProtected}
            </motion.p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Investment</p>
            <motion.p
              className="text-xl font-bold text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {strategy.summary.investment}
            </motion.p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Timeline</p>
            <motion.p
              className="text-xl font-bold text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {strategy.summary.timeline}
            </motion.p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">AI Confidence</p>
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xl font-bold text-primary">
                {strategy.summary.overallConfidence}%
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Recommendation Box */}
      <motion.div
        variants={itemVariants}
        className="p-4 rounded-lg bg-card border-2 border-accent/30 flex gap-3"
      >
        <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Recommendation
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Implement Phase 1 (Cool Roofs) immediately for quick impact. Prioritize
            Phase 2 (Urban Greening) in Shivajinagar and Pimpri for maximum ROI and
            population benefit.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
