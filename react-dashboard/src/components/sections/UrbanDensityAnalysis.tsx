'use client'

import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts'
import { cityZones } from '@/lib/mockData'

const densityData = cityZones.map((zone) => ({
  name: zone.name,
  density: zone.buildingDensity,
  riskScore: zone.riskScore,
  population: zone.population / 1000,
}))

const correlationData = [
  { density: 30, risk: 35, name: 'Zone A' },
  { density: 45, risk: 52, name: 'Zone B' },
  { density: 62, risk: 68, name: 'Zone C' },
  { density: 78, risk: 85, name: 'Zone D' },
  { density: 55, risk: 58, name: 'Zone E' },
  { density: 42, risk: 45, name: 'Zone F' },
  { density: 71, risk: 78, name: 'Zone G' },
  { density: 38, risk: 42, name: 'Zone H' },
]

export default function UrbanDensityAnalysis() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Urban Density Impact Analysis
      </h2>

      {/* Density Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Building Density Distribution Across Zones
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={densityData}>
            <defs>
              <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#94A3B8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="density"
              stroke="#00D9FF"
              strokeWidth={2}
              dot={{ fill: '#00D9FF', r: 4 }}
              fill="url(#colorDensity)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Density-Risk Correlation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Density vs Risk Correlation
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="density"
              stroke="#94A3B8"
              name="Building Density %"
              label={{ value: 'Building Density %', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              stroke="#94A3B8"
              name="Heat Risk Score"
              label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter
              name="Zones"
              data={correlationData}
              fill="#00FF88"
              fillOpacity={0.7}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="p-4 rounded-lg bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-700/30"
      >
        <h3 className="font-semibold text-foreground mb-2">Key Insights</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Strong positive correlation (r=0.87) between building density and heat risk</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Zones above 60% density are classified as high-risk areas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Urban density reduction and green space integration are key intervention strategies</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}
