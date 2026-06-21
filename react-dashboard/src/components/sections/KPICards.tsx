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
  AreaChart,
  Area,
} from 'recharts'
import { dashboardMetrics, kpiTrendData } from '@/lib/mockData'
import { Cloud, Thermometer, AlertTriangle, Zap, ThermometerSnowflake, TrendingDown, Target } from 'lucide-react'
import { useData } from '@/contexts/DataContext'

export default function KPICards() {
  const { data, isOptimized } = useData()

  let avgBase = 0;
  let avgMitigated = 0;
  let maxDrop = 0;
  let interventions = 0;

  if (data && data.length > 0) {
    avgBase = data.reduce((acc, curr) => acc + curr.Baseline_Predicted_LST, 0) / data.length;
    avgMitigated = data.reduce((acc, curr) => acc + curr.Final_Mitigated_LST, 0) / data.length;
    data.forEach(pixel => {
      const drop = pixel.Baseline_Predicted_LST - pixel.Final_Mitigated_LST;
      if (drop > maxDrop) maxDrop = drop;
      if (pixel.Assigned_Intervention === 'Cool_Roof' || pixel.Assigned_Intervention === 'Urban_Greening') {
        interventions++;
      }
    });
  }
  const avgDrop = avgBase - avgMitigated;

  const kpis = [
    {
      icon: Thermometer,
      label: 'Baseline Avg LST',
      value: `${avgBase.toFixed(2)} °C`,
      change: 'Shivajinagar block',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: ThermometerSnowflake,
      label: isOptimized ? 'Mitigated Avg LST' : 'Target Mitigated LST',
      value: `${avgMitigated.toFixed(2)} °C`,
      change: `City-wide Drop: -${avgDrop.toFixed(2)} °C`,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: TrendingDown,
      label: 'Peak Localized Drop',
      value: `-${maxDrop.toFixed(2)} °C`,
      change: 'Maximum cooling achieved',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Target,
      label: 'Budget Utilized',
      value: `${interventions} Pixels`,
      change: 'Strict 10% Municipal Quota',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: AlertTriangle,
      label: 'Heat Stress Index',
      value: `${dashboardMetrics.heatStressIndex.toFixed(1)}/10`,
      change: 'Critical threshold',
      color: 'from-destructive to-red-700',
    },
    {
      icon: Zap,
      label: 'Cooling Potential',
      value: `${dashboardMetrics.coolingPotential.toFixed(1)}°C`,
      change: 'Maximum achievable',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Mission Control - Key Metrics
      </h2>

      {/* KPI Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 hover:border-primary/50 transition-all duration-300 cursor-default"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${kpi.color} transition-opacity duration-300`}
              />

              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20"
                initial={false}
                whileHover={{
                  background:
                    'radial-gradient(circle at var(--mouse-x), rgba(0, 217, 255, 0.2), transparent 80%)',
                }}
              />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {kpi.label}
                  </p>
                  <motion.p
                    className="text-2xl font-bold text-foreground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    {kpi.value}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {kpi.change}
                  </p>
                </div>
                <motion.div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Temperature Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Monthly Trend Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={kpiTrendData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6F00" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF6F00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#FF6F00"
              fillOpacity={1}
              fill="url(#colorTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Risk Score Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Heat Risk Score Progression
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={kpiTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94A3B8" />
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
              dataKey="riskScore"
              stroke="#FF1744"
              strokeWidth={2}
              dot={{ fill: '#FF1744', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
