'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Users, MapPin, Wallet } from 'lucide-react'
import { dashboardMetrics } from '@/lib/mockData'
import { formatNumber } from '@/lib/climate-utils'

export default function ImpactSummaryCard() {
  const impacts = [
    {
      icon: TrendingDown,
      label: 'Urban Heat Reduced',
      value: '2.9°C',
      subValue: '↓ 7.2% reduction',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      label: 'People Protected',
      value: '84,000',
      subValue: '26.3% of population',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: MapPin,
      label: 'Priority Zones',
      value: '14',
      subValue: 'Addressed areas',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Wallet,
      label: 'Budget Required',
      value: '₹18 Cr',
      subValue: 'Implementation cost',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {impacts.map((impact, idx) => {
        const Icon = impact.icon
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 p-6"
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${impact.color} transition-opacity duration-300`}
            />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${impact.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {impact.label}
                </span>
              </div>

              <div>
                <p className="text-2xl font-bold text-foreground">
                  {impact.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {impact.subValue}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Risk Score Box */}
      <motion.div
        variants={itemVariants}
        className="col-span-2 md:col-span-4 relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/50 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Current Heat Risk Score
            </p>
            <p className="text-4xl font-bold text-foreground mt-2">
              {dashboardMetrics.overallRiskScore}
              <span className="text-lg text-destructive ml-2">/ 100</span>
            </p>
            <p className="text-sm text-destructive font-semibold mt-1">
              Extreme - Immediate Action Required
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Post-Optimization Score
            </p>
            <p className="text-3xl font-bold text-accent mt-2">48 / 100</p>
            <p className="text-sm text-accent font-semibold mt-1">
              Moderate - Sustainable Level
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
