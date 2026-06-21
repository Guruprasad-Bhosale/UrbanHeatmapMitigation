'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { cityZones } from '@/lib/mockData'
import { Leaf, AlertTriangle } from 'lucide-react'

const vegetationData = cityZones.map((zone) => ({
  name: zone.name.substring(0, 3),
  deficit: zone.vegetationDeficit,
  optimal: 100 - zone.vegetationDeficit,
}))

const distributionData = [
  { name: 'Tree Coverage', value: 22 },
  { name: 'Green Spaces', value: 18 },
  { name: 'Built Area', value: 60 },
]

const COLORS = ['#00FF88', '#00D9FF', '#0B1220']

export default function VegetationDeficitMap() {
  const avgDeficit =
    cityZones.reduce((sum, z) => sum + z.vegetationDeficit, 0) / cityZones.length

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Vegetation Deficit & Green Space Analysis
      </h2>

      {/* Deficit Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-lg bg-card border border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Average Vegetation Deficit
          </h3>
          <Leaf className="w-5 h-5 text-accent opacity-70" />
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="relative h-32 bg-background rounded-lg border border-border/30 overflow-hidden">
              {/* Deficit Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${avgDeficit}%` }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500 to-yellow-500 opacity-80"
              />
              {/* Optimal Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${100 - avgDeficit}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-green-500 to-emerald-500 opacity-80"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-destructive">
              {avgDeficit.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Deficit</p>
          </div>
        </div>

        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Optimal: {(100 - avgDeficit).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Deficit: {avgDeficit.toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Vegetation Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Zone-by-Zone Vegetation Deficit
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={vegetationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar dataKey="optimal" fill="#00FF88" name="Green Coverage" />
            <Bar dataKey="deficit" fill="#FF9500" name="Vegetation Deficit" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Area Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Land Use Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-green-700/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-accent" />
            Vegetation Enhancement Strategy
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Plant 45,000 trees across priority zones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Convert 120 hectares to green spaces</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Establish vertical gardens on buildings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Target deficit reduction: -15% by 2028</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Critical Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-lg bg-orange-900/20 border border-orange-700/50 flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Critical Vegetation Deficit Zones
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Zones with deficit above 60% require immediate green space interventions
          </p>
        </div>
      </motion.div>
    </div>
  )
}
