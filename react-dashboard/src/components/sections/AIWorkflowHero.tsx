'use client'

import { motion } from 'framer-motion'
import { Satellite, Brain, Zap } from 'lucide-react'

export default function AIWorkflowHero() {
  const steps = [
    {
      icon: Satellite,
      label: 'Satellite Data',
      description: 'Real-time thermal imaging',
    },
    {
      icon: Brain,
      label: 'AI Analysis',
      description: 'Pattern recognition',
    },
    {
      icon: Zap,
      label: 'Optimized Plan',
      description: 'Cooling interventions',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-3 gap-6 relative"
    >
      {steps.map((step, idx) => {
        const Icon = step.icon
        return (
          <div key={idx} className="relative">
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-foreground">
                  {step.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>

            {/* Arrow between steps */}
            {idx < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + idx * 0.2, duration: 0.6 }}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
              >
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full" />
              </motion.div>
            )}
          </div>
        )
      })}
    </motion.div>
  )
}
