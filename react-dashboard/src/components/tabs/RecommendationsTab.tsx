'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import StrategyCard from '@/components/sections/StrategyCard'
import SDGAlignment from '@/components/sections/SDGAlignment'
import AIAssistant from '@/components/sections/AIAssistant'
import { containerVariants } from '@/lib/animation-utils'

export default function RecommendationsTab() {
  const [expandedView, setExpandedView] = useState<'strategy' | 'technical' | null>(
    'strategy'
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 px-6 py-8 mx-auto max-w-7xl"
    >
      {/* Main Strategy Recommendation */}
      <StrategyCard />

      {/* SDG Alignment */}
      <SDGAlignment />

      {/* View Toggle */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-3 justify-center py-4"
      >
        <button
          onClick={() =>
            setExpandedView(expandedView === 'strategy' ? null : 'strategy')
          }
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          {expandedView === 'strategy'
            ? 'Hide Strategy Details'
            : 'Show Strategy Details'}
        </button>
        <button
          onClick={() =>
            setExpandedView(
              expandedView === 'technical' ? null : 'technical'
            )
          }
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/90 transition-colors"
        >
          {expandedView === 'technical'
            ? 'Hide Technical View'
            : 'Show Technical View'}
        </button>
      </motion.div>

      {/* Expanded Views */}
      <AnimatePresence>
        {expandedView === 'strategy' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-lg bg-card border border-border/50">
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Phased Implementation Timeline
              </h4>
              <div className="space-y-4">
                {[
                  {
                    phase: 'Phase 1: Immediate (0-6 months)',
                    action:
                      'Deploy cool roof initiative in commercial zones - Quick ROI',
                  },
                  {
                    phase: 'Phase 2: Short-term (6-12 months)',
                    action:
                      'Plant urban greening across priority zones - Highest impact',
                  },
                  {
                    phase: 'Phase 3: Medium-term (12-18 months)',
                    action:
                      'Establish water bodies and retention systems - Long-term cooling',
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {item.phase}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.action}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {expandedView === 'technical' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-lg bg-card border border-border/50">
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Advanced Technical Details
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Model Performance
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    R² Score: 0.89 | RMSE: 0.67°C | MAE: 0.48°C
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Physics Constraints
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    Latent heat transfer, albedo effects, vegetation transpiration
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Data Sources
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    Sentinel-2 satellite imagery, ground meteorology, urban cadastral
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant */}
      <AIAssistant />
    </motion.div>
  )
}
