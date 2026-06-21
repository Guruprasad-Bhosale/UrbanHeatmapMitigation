'use client'

import { motion } from 'framer-motion'
import { Globe, Heart, Leaf } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/animation-utils'

const sdgs = [
  {
    id: 13,
    title: 'Climate Action',
    description: 'Take urgent action to combat climate change and its impacts',
    icon: Leaf,
    color: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-500/30',
  },
  {
    id: 11,
    title: 'Sustainable Cities',
    description: 'Make cities and human settlements inclusive, safe, resilient',
    icon: Globe,
    color: 'from-yellow-500 to-amber-600',
    borderColor: 'border-yellow-500/30',
  },
  {
    id: 3,
    title: 'Good Health & Well-being',
    description: 'Ensure healthy lives and promote well-being for all',
    icon: Heart,
    color: 'from-red-500 to-rose-600',
    borderColor: 'border-red-500/30',
  },
]

export default function SDGAlignment() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Alignment with UN Sustainable Development Goals
        </h3>
        <p className="text-sm text-muted-foreground">
          UrbanHeatAI supports critical global sustainability targets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sdgs.map((sdg, idx) => {
          const Icon = sdg.icon
          return (
            <motion.div
              key={sdg.id}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-lg bg-gradient-to-br ${sdg.color} bg-opacity-5 border ${sdg.borderColor} group cursor-default transition-all`}
            >
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div
                  className={`p-2 rounded-lg bg-gradient-to-br ${sdg.color} text-white flex-shrink-0`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div className="flex-1">
                  <motion.p
                    className="font-semibold text-foreground text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.1 }}
                  >
                    SDG {sdg.id}: {sdg.title}
                  </motion.p>
                  <motion.p
                    className="text-xs text-muted-foreground mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                  >
                    {sdg.description}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        variants={itemVariants}
        className="p-4 rounded-lg bg-card border border-border/50 flex gap-2"
      >
        <div className="flex-shrink-0">
          <Globe className="w-5 h-5 text-primary mt-0.5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Global Impact
          </p>
          <p className="text-sm text-foreground mt-1">
            This solution contributes to reducing urban heat-related mortality,
            improving air quality, protecting vulnerable populations, and supporting
            global climate commitments under the Paris Agreement.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
