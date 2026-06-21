'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cityZones } from '@/lib/mockData'
import { ZoomIn, ZoomOut, MapPin } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import SpatialGrid from '../SpatialGrid'

interface GeospatialHeatmapProps {
  onZoneSelect: (zone: string) => void
  selectedZone: string
}

export default function GeospatialHeatmap({
  onZoneSelect,
  selectedZone,
}: GeospatialHeatmapProps) {
  const [zoom, setZoom] = useState(1)
  const { data, isOptimized, loading } = useData()
  const maxZoom = 3
  const minZoom = 0.8

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return '#FF1744' // Red - Extreme
    if (riskScore >= 60) return '#FFC400' // Orange - Severe
    if (riskScore >= 40) return '#FFEB3B' // Yellow - Moderate
    return '#00FF88' // Green - Safe
  }

  const getRiskLabel = (riskScore: number) => {
    if (riskScore >= 80) return 'Extreme'
    if (riskScore >= 60) return 'Severe'
    if (riskScore >= 40) return 'Moderate'
    return 'Safe'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Geospatial Heat Risk Distribution
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Click on zones to view detailed risk analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(minZoom, zoom - 0.2))}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground px-2">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(maxZoom, zoom + 0.2))}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-xl border border-border/50 bg-card p-6 overflow-hidden"
      >
        {/* Real Spatial Grid from PyTorch PINN model */}
        <div
          className="mx-auto w-full flex justify-center items-center"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {loading ? (
            <div className="py-20 text-muted-foreground animate-pulse">Loading spatial dataset...</div>
          ) : (
            <div className="w-full max-w-2xl">
              <SpatialGrid data={data} isOptimized={isOptimized} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30">
        <div className="flex items-center gap-4 text-xs">
          {[
            { label: 'Extreme (80+)', color: '#FF1744' },
            { label: 'Severe (60-79)', color: '#FFC400' },
            { label: 'Moderate (40-59)', color: '#FFEB3B' },
            { label: 'Safe (<40)', color: '#00FF88' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        {selectedZone !== '' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-semibold"
          >
            <MapPin className="w-4 h-4" />
            {cityZones.find((z) => z.id === selectedZone)?.name}
          </motion.div>
        )}
      </div>

      {/* Selected Zone Info */}
      {selectedZone !== '' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-card border border-primary/30"
        >
          {cityZones
            .filter((z) => z.id === selectedZone)
            .map((zone: typeof cityZones[0]) => (
              <div key={zone.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{zone.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-black`}
                    style={{ backgroundColor: getRiskColor(zone.riskScore) }}>
                    {getRiskLabel(zone.riskScore)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Temperature</p>
                    <p className="font-semibold text-foreground">{zone.currentTemp.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cooling Potential</p>
                    <p className="font-semibold text-accent">{zone.coolingPotential.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Population</p>
                    <p className="font-semibold text-foreground">
                      {(zone.population / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Building Density</p>
                    <p className="font-semibold text-foreground">{zone.buildingDensity}%</p>
                  </div>
                </div>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  )
}
